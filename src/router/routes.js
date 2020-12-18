
const routes = [
  {
    path: "/",
    component: () => import("layouts/default.vue"),
    name: 'Home',
    children: [
      { path: "", component: () => import("pages/index.vue"), name: 'Home' },
      {
        path: "/chapter/:chapter",
        component: () => import("pages/chapter.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes
