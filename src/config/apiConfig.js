export const apiConfig = {
    endpoints: {
        // Auth
        auth: "/auth",
        login: "/auth/login",
        register: "/auth/register",
        refresh: "/auth/refresh",
        logout: "/auth/logout",

        // Students
        students: "/students",
        registerStudent: "/students/register",
        studentsFilter: "/students/filter",

        // Master Data
        universities: "/universities",
        courses: "/courses",
        batches: "/batches",
        nationalities: "/nationalities",
        paymentModes: "/payment-modes",
        coursePackages: "/course-packages",
        batchPreferences: "/batch-preferences",
        courseModes: "/course-modes",

        // Payments
        payments: "/payments",
        initiatePayment: "/payments/initiate",
        emiPayments: "/payments/emi",

        // PDF
        invoice: "/pdf/invoice",        // You will append /:studentId/:paymentId
        receipt: "/pdf/receipt",        // You will append /:studentId/:paymentId

        // WhatsApp
        reminder: "/reminder",          // You will append /:studentId

        // Admin & Dashboards
        adminDashboard: "/admin/dashboard",
        studentDashboard: "/student/dashboard",
        adminSummary: "/admin/summary",

        // Menus
        menus: "/menus",
    },
};
