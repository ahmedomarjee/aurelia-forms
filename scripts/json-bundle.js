define('text!localization-neutral.json',[],function () { return '{\r\n  "login-form": {\r\n    "form_title": "Anmeldedaten",\r\n    "enter_user_password_text": "Geben Sie hier Ihren Benutzernamen und Passwort ein und klicken Sie auf \\"Anmelden\\".",\r\n    "username_caption": "Benutzername",\r\n    "password_caption": "Passwort",\r\n    "stayloggodon_caption": "Angemeldet bleiben"\r\n  },\r\n  "authgroup-edit": {\r\n    "form_title": "Berechtigungsgruppe",\r\n    "info_text": {\r\n      "text": "Hallo {0}",\r\n      "parameters": [\r\n        "models.data.$m_A.Name"\r\n      ]\r\n    },\r\n    "name_caption": "Bezeichnung",\r\n    "mandator_caption": "Mandant"\r\n  },\r\n  "authgroup-list": {\r\n    "form_title": "Berechtigungsgruppen",\r\n    "name_caption": "Bezeichnung",\r\n    "mandantor_caption": "Mandant"\r\n  },\r\n  "base": {\r\n    "save": "Speichern",\r\n    "delete": "Löschen",\r\n    "question": "Frage",\r\n    "information": "Information",\r\n    "sure_delete_question": "Sind Sie sicher, dass sie den aktuellen Datensatz löschen wollen?",\r\n    "login": "Anmelden",\r\n    "logout": "Abmelden"\r\n  },\r\n  "login-form-funcs": {\r\n    "anmelden_caption": "Anmelden"\r\n  },\r\n  "routes": {\r\n    "settings": "Einstellungen"\r\n  }\r\n}';});

define('text!routes/forms.json',[],function () { return '{\r\n  "framework/security/views/authgroup/authgroup-edit-form": {\r\n    "id_parent": null,\r\n    "category": null,\r\n    "caption": "authgroup-edit.form_title",\r\n    "route": "security/authgroup/:id",\r\n    "isEnabled": false,\r\n    "moduleId": "framework/security/views/authgroup/authgroup-edit-form",\r\n    "idParent": null\r\n  },\r\n  "framework/security/views/authgroup/authgroup-list-form": {\r\n    "id_parent": "settings",\r\n    "category": null,\r\n    "caption": "authgroup-list.form_title",\r\n    "route": "security/authgroup",\r\n    "isEnabled": true,\r\n    "moduleId": "framework/security/views/authgroup/authgroup-list-form",\r\n    "idParent": "settings"\r\n  }\r\n}';});

define('text!routes/structure.json',[],function () { return '[\r\n  {\r\n    "id": "settings",\r\n    "caption": "routes.settings",\r\n    "icon": "shield"\r\n  }\r\n]';});
