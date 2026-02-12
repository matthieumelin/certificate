import * as Yup from "yup";

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const dayScheduleSchema = Yup.object().shape({
  morning_start: Yup.string()
    .test("valid-time-format", "Format invalide (HH:MM)", (value) => {
      if (!value) return true;
      return timeRegex.test(value);
    })
    .test(
      "valid-morning-range",
      "L'heure de début doit être avant l'heure de fin",
      function (value) {
        const { morning_end } = this.parent;
        if (!value || !morning_end) return true;
        return value < morning_end;
      },
    ),
  morning_end: Yup.string().test(
    "valid-time-format",
    "Format invalide (HH:MM)",
    (value) => {
      if (!value) return true;
      return timeRegex.test(value);
    },
  ),
  afternoon_start: Yup.string()
    .test("valid-time-format", "Format invalide (HH:MM)", (value) => {
      if (!value) return true;
      return timeRegex.test(value);
    })
    .test(
      "valid-afternoon-range",
      "L'heure de début doit être avant l'heure de fin",
      function (value) {
        const { afternoon_end } = this.parent;
        if (!value || !afternoon_end) return true;
        return value < afternoon_end;
      },
    ),
  afternoon_end: Yup.string().test(
    "valid-time-format",
    "Format invalide (HH:MM)",
    (value) => {
      if (!value) return true;
      return timeRegex.test(value);
    },
  ),
});

const partnerInfoSchema = Yup.object().shape({
  address: Yup.string()
    .required("L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(255, "L'adresse ne peut pas dépasser 255 caractères"),

  postal_code: Yup.string()
    .required("Le code postal est requis")
    .min(4, "Le code postal doit contenir au moins 4 caractères")
    .max(10, "Le code postal ne peut pas dépasser 10 caractères"),

  city: Yup.string()
    .required("La ville est requise")
    .min(2, "Le nom de la ville doit contenir au moins 2 caractères")
    .max(100, "Le nom de la ville ne peut pas dépasser 100 caractères"),

  country: Yup.string()
    .required("Le pays est requis")
    .min(2, "Le nom du pays doit contenir au moins 2 caractères")
    .max(100, "Le nom du pays ne peut pas dépasser 100 caractères"),

  show_hours: Yup.boolean(),

  hours: Yup.object().shape({
    monday: dayScheduleSchema,
    tuesday: dayScheduleSchema,
    wednesday: dayScheduleSchema,
    thursday: dayScheduleSchema,
    friday: dayScheduleSchema,
    saturday: dayScheduleSchema,
    sunday: dayScheduleSchema,
  }),

  by_appointment: Yup.boolean(),
});

export default partnerInfoSchema;
