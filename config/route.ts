const route = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/businessAdm/enter',
          },
          {
            path: '/businessAdm',
            name: '企业管理',
            icon: 'home',
            routes: [
              {
                path: 'enter',
                name: '入驻企业',
                component: './businessAdm/businessEnter',
              },
              {
                path: 'examine',
                name: '入驻审核',
                component: './commodity/commodityAdm/CommodityAdm.tsx',
              },
              {
                path: 'enter/particulars',
                name: '查看详情',
                component: './businessAdm/particulars',
                hideInMenu: true,
              },
            ],
          },
          {
            path: '/commodityAdm',
            name: '商品管理',
            icon: 'shop',
            routes: [
              {
                path: '/commodityAdm/management',
                name: '商品列表',
                component: './commodity/commodityAdm/CommodityAdm.tsx',
              },
              {
                path: 'management/particulars',
                name: '查看详情',
                component: './commodity/commodityAdm/CommodityDet.tsx',
                hideInMenu: true,
              },
              {
                path: '/commodityAdm/management/edit',
                name: '产品编辑',
                component: './commodity/commodityAdm/CommodityEdit.tsx',
                hideInMenu: true,
              },
            ],
          },
          // 用户
          // {
          //   path: '/admin',
          //   name: 'admin',
          //   icon: 'crown',
          //   component: './Admin',
          //   authority: ['admin'],
          // },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

  {
    component: './404',
  },
];
export default route;
