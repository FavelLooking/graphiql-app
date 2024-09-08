import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      buttons: {
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        login: "Login",
        register: "Registration",
        restClient: "REST Client",
        graphiqlClient: "GraphiQL Client",
        history: "History",
      },
      titles: {
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
      },
      welcome: "Welcome to REST/GraphiQL Client!",
      description:
        "This project is developed as part of the RS School React course andaims to provide a client interface for interacting with RESTful and GraphQL APIs.",
      developers: "About the Developers",
      github: "GitHub Profile",
      maxim: "Maxim",
      maximTasks: {
        task1:
          "Implemented Sign In/Sign Up functionality with client-side validation.",
        task2:
          "Created the History route to restore previous requests for both REST and GraphQL clients.",
        task3:
          "Designed the Welcome route logic to manage token expiration and user redirection.",
      },
      pavel: "Pavel",
      pavelTasks: {
        task1:
          "Developed the GraphiQL client, including query editing and response sections.",
        task2: "Implemented the documentation explorer for GraphQL requests.",
        task3:
          "Added support for managing headers and variables within the GraphQL client.",
      },
      fedor: "Fedor",
      fedorTasks: {
        task1:
          "  Built the RESTful client with full support for query editing and method selection.",
        task2:
          "  Developed a functional response section for RESTful API interactions.",
        task3: "Added base64 encoding support for URL and request bodies.",
      },
      cource: "About the Course",
      courseInfo:
        'This project is part of the <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">RS School React course</a>, which covers modern React development practices, including routing, client-side state management, and API interactions.',
      emptyHistoryP1: "You haven't executed any requests yet.",
      emptyHistoryP2: "It's empty here. Try those options:",
      historyDescription: "History of your requests will be displayed here.",
    },
  },
  ru: {
    translation: {
      buttons: {
        signIn: "Войти",
        signUp: "Зарегистрироваться",
        signOut: "Выйти",
        login: "Авторизация",
        register: "Регистрация",
        restClient: "REST клиент",
        graphiqlClient: "GraphiQL клиент",
        history: "История",
      },
      titles: {
        email: "Электронная почта",
        password: "Пароль",
        confirmPassword: "Подтверждение пароля",
      },
      welcome: "Добро пожаловать в REST/GraphiQL клиент!",
      description:
        "Этот проект разработан в рамках курса RS School React и направлен на предоставление клиентского интерфейса для взаимодействия с RESTful иGraphQL API.",
      developers: "Разработчики",
      github: "Профиль на GitHub",
      maxim: "Максим",
      maximTasks: {
        task1:
          "Реализовал функционал входа/регистрации с проверкой на стороне клиента.",
        task2:
          "Создал маршрут History для восстановления предыдущих запросов как для REST, так и для GraphQL клиентов.",
        task3:
          "Разработал логику маршрута Welcome для управления сроком действия токена и перенаправления пользователей.",
      },
      pavel: "Павел",
      pavelTasks: {
        task1:
          "Разработал график клиента, включая редактирование запросов и разделы ответа.",
        task2: "Реализовал проводник для запросов GraphQL.",
        task3:
          " Добавил поддержку управления заголовками и переменными в графике клиента.",
      },
      fedor: "Федор",
      fedorTasks: {
        task1:
          "  Создал RESTful клиент с полной поддержкой редактирования запросов и выбора метода.",
        task2: "  Реализовал функционал ответа для RESTful API взаимодействия.",
        task3: "Добавил поддержку base64 для URL и тела запроса.",
      },
      cource: "Курс",
      courseInfo:
        'Этот проект является частью <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">курса RS School React</a>, который охватывает современные практики разработки на React, включая маршрутизацию, управление состоянием на стороне клиента и взаимодействие с API.',
      emptyHistoryP1: "Вы еще не выполнили никаких запросов.",
      emptyHistoryP2: "Тут пусто. Попробуйте эти варианты:",
      historyDescription: "История ваших запросов будет отображаться здесь.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
