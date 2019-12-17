import { Effect } from 'dva';
import { Reducer } from 'redux';
import { queryBusiness, insertBusiness, saveBusiness, switchStatus } from '@/services/businessAdm';
const businessAdm = {
  namespace: 'businessAdm',

  state: {
    businessData: [],
    queryForm: {
      adminName: '',
      endTime: '',
      startTime: '',
      status: '',
      channel: '',
      tenantName: '',
      province: [],
    },
    pagenation: {
      pageNumber: 0,
      pageSize: 10,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => {
        return `共 ${total} 条`;
      },
    },
    currentRecord: {},
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      if (payload.province && payload.province.length > 0) {
        payload.province = payload.province.join(',');
      }
      const response = yield call(queryBusiness, payload);
      if (response && response.code === 1) {
        yield put({
          type: 'queryData',
          payload: response.data,
        });
      }
      return response;
    },
    *queryFormChange({ payload }, { call, put }) {
      yield put({
        type: 'formChange',
        payload: payload,
      });
      return payload;
    },
    *queryPagenationChange({ payload }, { call, put }) {
      yield put({
        type: 'pageNationChange',
        payload: payload,
      });
      return payload;
    },
    *currentRecord({ payload }, { call, put }) {
      yield put({
        type: 'record',
        payload: payload,
      });
      return payload;
    },
    *saveBusiness({ payload }, { call, put, select }) {
      const data = yield select(state => state.businessAdm.currentRecord);
      let response = {};
      let tempenterpriseQualification = [];
      if (payload.enterpriseQualification.length > 0) {
        payload.enterpriseQualification.forEach(item => {
          if (!item.url) {
            item.url = item.response.data;
          }
          tempenterpriseQualification.push({
            name: item.name,
            url: item.url,
          });
        });
        payload.enterpriseQualification = tempenterpriseQualification;
      }
      let tempstoreLive = [];
      if (payload.storeLive.length > 0) {
        payload.storeLive.forEach(item => {
          if (!item.url) {
            item.url = item.response.data;
          }
          tempstoreLive.push(item.url);
        });
        payload.storeLive = tempstoreLive;
      }
      let tempParam = Object.assign({}, data, payload);
      if (data && data.tenantId) {
        // 更新
        response = yield call(saveBusiness, tempParam);
      } else {
        // 新增
        response = yield call(insertBusiness, tempParam);
      }

      if (response && response.code === 1) {
        yield put({
          type: 'saveData',
          payload: response.data,
        });
      }
      return response;
    },
    *switchStatus({ payload }, { call, put }) {
      const response = yield call(switchStatus, payload);
      if (response && response.code === 1) {
        yield put({
          type: 'switchSave',
          payload: payload,
        });
      }
      return response;
    },
  },

  reducers: {
    queryData(state, action) {
      let pagenation = {
        pageNumber: action.payload.pageNumber,
        pageSize: action.payload.pageSize,
        total: action.payload.totalElements,
      };
      return {
        ...state,
        businessData: action.payload.pageList || [],
        pageNation: pagenation,
      };
    },
    formChange(state, action) {
      return {
        ...state,
        queryForm: action.payload,
      };
    },
    pageNationChange(state, action) {
      let tempPagenation = {
        ...state.pagenation,
        ...action.payload,
      };
      return {
        ...state,
        pagenation: tempPagenation,
      };
    },
    record(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
    saveData(state, action) {
      return {
        ...state,
        currentRecord: action.payload,
      };
    },
    switchSave(state, action) {
      let tempbusinessData = state.businessData;
      let result = action.payload;
      tempbusinessData.map(item => {
        if (item.tenantId === result.tenantId) {
          item.status = result.status;
        }
        return item;
      });
      return {
        ...state,
        businessData: tempbusinessData,
      };
    },
  },
};

export default businessAdm;
