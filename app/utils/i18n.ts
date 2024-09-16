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
        addVariable: "Add Variable",
        addHeader: "Add Header",
        sendRequest: "Send Request",
        submit: "Submit",
        prettify: "Prettify",
        getSDLScheme: "Get SDL Scheme",
        hide: "Hide Variables",
        show: "Show Variables",
        mainButton: "Main Page",
      },
      titles: {
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        variable: "Variable",
        header: "Header",
        headers: "Headers",
        body: "Body",
        graphql: "GraphQL Client",
        response: "Response",
        documentation: "Documentation",
        taskGH: "Task GH",
        endpointURL: "Endpoint URL:",
      },
      placeholders: {
        apiEndpoint: "Endpoint API",
        variableKey: "Variable Key",
        variableValue: "Variable Value",
        headerKey: "Header Key",
        headerValue: "Header Value",
        enterURL: "please, enter URL",
        enterGraphQLQuery: "Enter GraphQL query here...",
        enterGraphQLVariables: "Enter GraphQL variables here (JSON format)...",
      },
      notifications: {
        successLogin: "Login successful! Redirecting...",
        successRegister: "Registration successful! Redirecting...",
        errorLogin: "Error logging in. Please check your credentials.",
        errorRegister: "Error registering. Please try again.",
        schemeSuccess: "Cool! Here is you scheme",
        schemeFail: "Error fetching scheme",
        urlFail: "URL isn't valid",
      },
      welcome: "Welcome to REST/GraphiQL Client!",
      description:
        "This project is developed as part of the RS School React course and aims to provide a client interface for interacting with RESTful and GraphQL APIs.",
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
      emptyResponse: "Right now it's empty",
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
        addVariable: "Добавить переменную",
        addHeader: "Добавить заголовок",
        sendRequest: "Отправить запрос",
        submit: "Отправить",
        prettify: "Форматировать",
        getSDLScheme: "Получить SDL схему",
        hide: "Показать переменные",
        show: "Скрыть переменные",
        mainButton: "Главная страница",
      },
      titles: {
        email: "Электронная почта",
        password: "Пароль",
        confirmPassword: "Подтверждение пароля",
        variable: "Переменная",
        header: "Заголовок",
        headers: "Заголовки",
        body: "Тело",
        graphql: "GraphQL клиент",
        response: "Ответ",
        documentation: "Документация",
        taskGH: "Задача на GH",
        endpointURL: "Эндпоинт URL:",
      },
      placeholders: {
        apiEndpoint: "Эндпоинт API ",
        variableKey: "Ключ переменной",
        variableValue: "Значение переменной",
        headerKey: "Ключ заголовка",
        headerValue: "Значение заголовка",
        enterURL: "пожалуйста, введите URL",
        enterGraphQLQuery: "Введите запрос GraphQL здесь...",
        enterGraphQLVariables:
          "Введите GraphQL переменную здесь (JSON формат)...",
      },
      notifications: {
        successLogin: "Логин успешно выполнен! Перенаправление...",
        successRegister: "Регистрация успешна! Перенаправление...",
        errorLogin: "Ошибка входа. Пожалуйста, проверьте ваши учетные данные.",
        errorRegister: "Ошибка регистрации. Пожалуйста, попробуйте еще раз.",
        schemeSuccess: "Отлично! Держи свою схему",
        schemeFail: "Ошибка получения схемы",
        urlFail: "URL невалиден",
      },
      welcome: "Добро пожаловать в REST/GraphiQL клиент!",
      description:
        "Этот проект разработан в рамках курса RS School React и направлен на предоставление клиентского интерфейса для взаимодействия с RESTful и GraphQL API.",
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
          "Разработал GraphQL клиент, включая редактирование запросов и разделы ответа.",
        task2: "Реализовал проводник для запросов GraphQL.",
        task3:
          " Добавил поддержку управления заголовками и переменными для GraphQL клиента.",
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
      emptyResponse: "В настоящее время тут пусто",
    },
  },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  debug: true,
});

export default i18n;
