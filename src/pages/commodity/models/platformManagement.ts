import {
  productList,
  product,
  editorProduct,
  newProduct,
  productype,
  shelve,
  productTemplateList,
  deletProduct,
  generateQR,
} from '@/services/commodity';
import deepCopy from '@/utils/deepCopy';
import filterProperty from '@/utils/filterProperty';

const tableFilterInfo = {
  currentPage: 1,
  createTimeOrder: undefined,
  preferentialLimit: undefined,
  preferentialQuantity: undefined,
  salesQuantity: undefined,
  pageSize: 10,
};
const searchFormInfo = {
  startTime: undefined,
  endTime: undefined,
  putawayStatus: 0,
  sellStatus: 0,
  productCommonName: '',
  approvalNumber: '',
};
const CommodityModel = {
  namespace: 'platformManagement',
  state: {
    productList: {},
    productWithId: {},
    productLog: [],
    searchForm: deepCopy(searchFormInfo),
    tableFilterInfo: deepCopy(tableFilterInfo),
  },
  effects: {
    // 获取商品列表
    *getList({ payload }, { call, put, select }) {
      const state = yield select(state => state.platformManagement);
      // params包括searchForm的属性,包括根据productListStatus获取的tabelConditionsItem属性
      const params = Object.assign({}, state.searchForm, state.tableFilterInfo);
      console.log('in_getList_platformManagement', state);

      params.pageNumber = params.currentPage - 1;
      // 过滤掉这个条件
      params.currentPage = '';
      const paramsInfo = filterProperty(params);
      const response = yield call(productList, paramsInfo);
      if (response.code === 1) {
        // 接口调用成功
        // do something...
        yield put({
          type: 'list',
          payload: response.data,
        });
        return response.data; //  通过return给dispatch返回回调结果！
      }
      // 接口调用失败
      // do something...
      return false;
    },
    // 依据id获取单个商品列表
    *getProduct({ payload }, { call, put }) {
      const response = yield call(product, payload);
      yield put({
        type: 'product',
        payload: response.data,
      });
      // 同时设置对应运费模版的信息
      if (response.data && response.data.product) {
        const { freightTemplates } = response.data.product;
        console.log('freightTemplates_', freightTemplates);
        let ordinaryTemplate = null;
        let urgentTemplate = null;
        const hasSelectTemplate = [];
        if (freightTemplates) {
          freightTemplates.forEach(item => {
            if (item.templateType === 2) {
              urgentTemplate = item;
            } else {
              ordinaryTemplate = item;
            }
          });
          if (urgentTemplate) {
            hasSelectTemplate.push(2);
          }
          if (ordinaryTemplate) {
            hasSelectTemplate.push(1);
          }
        }
        yield put({
          type: 'setProductDeliveryTemplate',
          payload: {
            ordinaryTemplate,
            urgentTemplate,
            hasSelectTemplate,
          },
        });
      }
    },
    // 新建产品
    *newProduct({ payload }, { call, put }) {
      const response = yield call(newProduct, payload);
      // yield put({
      //   type: 'successProduct',
      //   payload: response.data,
      // });
    },
    // 编辑产品
    *editProduct({ payload }, { call, put }) {
      console.log('in_editProduct');
      const response = yield call(editorProduct, payload);
      // yield put({
      //   type: 'successProduct',
      //   payload: response.data,
      // });
    },
    // 上下架产品
    *shelveProduct({ payload }, { call }) {
      console.log('in_shelveProduct');
      const response = yield call(shelve, payload);
      if (response.code === 1) {
        // 接口调用成功
        // do something...
        return true; //  通过return给dispatch返回回调结果！
      }
      // 接口调用失败
      // do something...
      return false;
    },
    // 删除商品
    *deletProduct({ payload }, { call }) {
      const response = yield call(deletProduct, payload);
    },
  },

  reducers: {
    // 获取商品列表
    list(state, action) {
      action.payload.pageList.forEach((element, index) => {
        element.key = index;
      });
      state.productList = action.payload;
      return {
        ...state,
        ...action.payload,
      };
    },
    // 获取单个商品
    product(state, action) {
      console.log('in product');

      return {
        ...state,
        productWithId: action.payload.product,
        productLog: action.payload.log,
      };
    },
    // 保存单个商品的信息
    saveProduct(state, action) {
      // console.log('in saveProduct_', action.payload);
      const newProduct = Object.assign({}, state.productWithId, action.payload);
      console.log('productWithId_', newProduct);
      return {
        ...state,
        productWithId: newProduct,
      };
    },
    // 重置所有铲平信息
    resetProduct(state, action) {
      console.log('in_resetProduct');
      return {
        ...state,
        productWithId: action.payload,
      };
    },
    // 编辑或者新建产品成功后
    // successProduct(state, action) {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },

    // allProductType(state, action) {
    //   state.allProductType = action.payload;
    //   console.log('state.allProductType_', action.payload);
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },
    // 重置commidityList列表
    resetList(state, action) {
      state.productList.pageList = action.payload;
      return {
        ...state,
        ...action.payload,
      };
    },
    // 设置商品列表table值
    setTabelConditions(state, action) {
      console.log('tabelConditions_', action.payload);
      return {
        ...state,
        tabelConditions: action.payload,
      };
    },
    // 重置按钮重置所有，除了当前tab
    resetForm(state, action) {
      // console.log('tabelConditionsInfo_', tabelConditionsInfo);
      return {
        ...state,
        tableFilterInfo: deepCopy(tableFilterInfo),
        searchForm: deepCopy(searchFormInfo),
      };
    },

    // 二期，保存商品searchForm信息
    saveSearchForm(state, action) {
      return {
        ...state,
        searchForm: action.payload,
      };
    },
    // 重置table页面的数据，如果传入属性则加上
    resetTable(state, action) {
      // const tableInfo = deepCopy(tableFilterInfo);
      const params = Object.assign({}, state.tableFilterInfo, action.payload);
      return {
        ...state,
        tableFilterInfo: params,
      };
    },
  },
};

export default CommodityModel;
