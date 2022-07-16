export interface Language {
  profile: {
    lvl: string;
    follow: {
      follows: string;
      followers: string;
    };
    links: {
      medias: string;
      save: string;
    };
    rating: string;
    bio: string;
    achievements: {
      title: string;
    };
  };
  header: {
    main: string;
    trends: string;
    rating: string;
    tournament: string;
    clans: string;
    marketplace: string;
    library: string;
    rewards: string;
    profile: string;
  };
  registration: {
    title: string;
    male: string;
    female: string;
    email: string;
    name: string;
    password: string;
    passwordRepeat: string;
    rulesCheck: string;
    button: string;
    swapMode: string;
  };
  login: {
    title: string;
    button: string;
    swapMode: string;
  };
  reset: {
    title: string;
    password: string;
    passwordRepeat: string;
    button: string;
    buttonSend: string;
    toLogin: string;
  };
}

export const ru: Language = {
  profile: {
    lvl: "Уровень",
    follow: {
      follows: "Подписок",
      followers: "Подписчиков",
    },
    links: {
      medias: "Социальные сети",
      save: "Сохранить",
    },
    rating: "Рейтинг",
    bio: "Что-либо о вас.",
    achievements: {
      title: "Достижения",
    },
  },
  header: {
    main: "Главная",
    trends: "Тренды",
    rating: "Рейтинг",
    tournament: "Соревнования",
    clans: "Кланы",
    marketplace: "Магазин",
    library: "Библиотека",
    rewards: "Награды",
    profile: "Профиль",
  },
  registration: {
    title: "Регистрация",
    male: "Мужчина",
    female: "Женщина",
    email: "Почта",
    name: "Имя",
    password: "Пароль",
    passwordRepeat: "Повторите пароль",
    rulesCheck: "Я согласен с правилами.",
    button: "Отправить",
    swapMode: "ЛОГИН",
  },
  login: {
    title: "Логин",
    button: "Войти",
    swapMode: "РЕГИСТРАЦИЯ",
  },
  reset: {
    title: "Восстановление",
    password: "Новый пароль",
    passwordRepeat: "Повторите пароль",
    button: "Восстановить",
    buttonSend: "Письмо отправлено",
    toLogin: "ЛОГИН",
  },
};

export const en: Language = {
  profile: {
    lvl: "Lvl",
    follow: {
      follows: "Follows",
      followers: "Followers",
    },
    links: {
      medias: "Social medias",
      save: "Save",
    },
    rating: "Rating",
    bio: "Anything about you.",
    achievements: {
      title: "Achievements",
    },
  },
  header: {
    main: "Main",
    trends: "Trends",
    rating: "Rating",
    tournament: "Tournament",
    clans: "Clans",
    marketplace: "Marketplace",
    library: "Library",
    rewards: "Rewards",
    profile: "Profile",
  },
  registration: {
    title: "Registration",
    male: "Male",
    female: "Female",
    email: "Email",
    name: "Name",
    password: "Password",
    passwordRepeat: "Repeat password",
    rulesCheck: "I agree with rules.",
    button: "Send",
    swapMode: "LOGIN",
  },
  login: {
    title: "Login",
    button: "Login",
    swapMode: "REGISTRATION",
  },
  reset: {
    title: "Reset",
    password: "New password",
    passwordRepeat: "Repeat password",
    button: "Reset",
    buttonSend: "Email has been send",
    toLogin: "LOGIN",
  },
};
