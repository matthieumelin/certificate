const routes = {
  Home: "/",
  NotFound: "/404",
  Cgu: "/cgu",

  /** Auth routes */
  Register: "/register",
  Login: "/login",
  Callback: "/auth/callback",
  ForgotPassword: "/forgot-password",
  Logout: "/logout",
  SetPassword: "/set-password",
  ResetPassword: "/reset-password",

  /** Dashboard routes */
  Dashboard: {
    Main: "/dashboard",
    Profile: "/dashboard/profile",
    Certificates: {
      Main: "/dashboard/certificates",
      Details: "/dashboard/certificates/details/:id",
    },
    Reminders: "/dashboard/reminders",

    /** Dashboard admin routes */
    Admin: {
      Main: "/dashboard/admin",
      Users: {
        List: "/dashboard/admin/users",
      },
      Partners: {
        List: "/dashboard/admin/partners",
        New: "/dashboard/admin/partners/new",
        Edit: "/dashboard/admin/partners/edit/:id",
      },
      Certificates: {
        List: "/dashboard/admin/certificates",
      },
      Payments: {
        List: "/dashboard/admin/payments",
      },
      Reports: {
        List: "/dashboard/admin/reports",
      },
    },

    /** Dashboard partner routes */
    Partner: {
      Certificates: {
        List: "/dashboard/partner/certificates",
      },
    },
    Payment: "/payment",
  },
};

export default routes;
