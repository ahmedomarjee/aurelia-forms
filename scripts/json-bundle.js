define('text!localization-neutral.json',[],function () { return '{\n  "login-form": {\n    "login-form_caption": "Anmeldedaten",\n    "enter_user_password_text": "Geben Sie hier Ihren Benutzernamen und Passwort ein und klicken Sie auf \\"Anmelden\\".",\n    "username_caption": "Benutzername",\n    "password_caption": "Passwort",\n    "stayloggodon_caption": "Angemeldet bleiben"\n  },\n  "authgroup-edit": {\n    "authgroup-edit_caption": "Berechtigungsgruppe",\n    "info_text": {\n      "text": "Hallo {0}",\n      "parameters": [\n        "models.data.$m_A.Name"\n      ]\n    },\n    "name_caption": "Bezeichnung",\n    "mandator_caption": "Mandant"\n  },\n  "authgroup-list": {\n    "authgroup-list_caption": "Berechtigungsgruppen",\n    "name_caption": "Bezeichnung",\n    "mandantor_caption": "Mandant"\n  },\n  "base": {\n    "add": "Neuer Datensatz",\n    "save": "Speichern",\n    "delete": "Löschen",\n    "question": "Frage",\n    "information": "Information",\n    "sure_delete_question": "Sind Sie sicher, dass sie den aktuellen Datensatz löschen wollen?",\n    "login": "Anmelden",\n    "logout": "Abmelden"\n  },\n  "login-form-funcs": {\n    "anmelden_caption": "Anmelden"\n  },\n  "routes": {\n    "settings": "Einstellungen"\n  }\n}';});

define('text!routes/forms.json',[],function () { return '{\n  "framework/security/views/authgroup/authgroup-edit-form": {\n    "idParent": null,\n    "category": null,\n    "caption": "authgroup-edit.authgroup-edit_caption",\n    "route": "security/authgroup/:id",\n    "icon": null,\n    "moduleId": "framework/security/views/authgroup/authgroup-edit-form",\n    "isEnabled": false\n  },\n  "framework/security/views/authgroup/authgroup-list-form": {\n    "idParent": "settings",\n    "category": null,\n    "caption": "authgroup-list.authgroup-list_caption",\n    "route": "security/authgroup",\n    "icon": null,\n    "moduleId": "framework/security/views/authgroup/authgroup-list-form",\n    "isEnabled": true\n  }\n}';});

define('text!routes/structure.json',[],function () { return '[\n  {\n    "id": "settings",\n    "caption": "routes.settings",\n    "icon": "shield"\n  }\n]';});
