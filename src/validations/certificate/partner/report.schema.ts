import * as Yup from "yup";

export const requiredFields = {
  general: [
    "general_object_type",
    "general_object_brand",
    "general_object_model",
    "general_object_reference",
    "general_object_serial_number",
    "general_comment",
  ],
  accessories: ["accessories_score", "accessories_images"],
  case: [
    "case_shape",
    "case_diameter.diameter",
    "case_thickness",
    "case_lug_width",
    "case_material",
    "case_factory",
    "case_setting",
    "case_setting_type",
    "case_score",
    "case_images",
  ],
  case_back: [
    "case_back_type",
    "case_back_material",
    "case_back_factory",
    "case_back_score",
  ],
  case_crown: [
    "case_crown_type",
    "case_crown_factory",
    "case_crown_score",
    "case_crown_images",
    "case_crown_pusher_factory",
    "case_crown_pusher_score",
    "case_crown_pusher_images",
  ],
  case_bezel: [
    "case_bezel_type",
    "case_bezel_material",
    "case_bezel_factory",
    "case_bezel_setting",
    "case_bezel_setting_type",
    "case_bezel_score",
    "case_bezel_images",
  ],
  case_bezel_insert: [
    "case_bezel_insert_material",
    "case_bezel_insert_factory",
    "case_bezel_insert_score",
  ],
  case_glass: ["case_glass_material", "case_glass_factory", "case_glass_score"],
  bracelet: [
    "bracelet_type",
    "bracelet_diameter.length",
    "bracelet_diameter.width",
    "bracelet_diameter.thickness",
    "bracelet_material",
    "bracelet_factory",
    "bracelet_setting",
    "bracelet_setting_type",
    "bracelet_score",
    "bracelet_images",
  ],
  bracelet_clasp: [
    "bracelet_clasp_type",
    "bracelet_clasp_material",
    "bracelet_clasp_factory",
    "bracelet_clasp_setting",
    "bracelet_clasp_setting_type",
    "bracelet_clasp_score",
    "bracelet_clasp_images",
  ],
  bracelet_link: ["bracelet_link_pump_type", "bracelet_link_factory"],
  dial: [
    "dial_type",
    "dial_material",
    "dial_color",
    "dial_patina_score",
    "dial_factory",
    "dial_setting",
    "dial_setting_type",
    "dial_score",
    "dial_images",
  ],
  dial_index: [
    "dial_index_type",
    "dial_index_style",
    "dial_index_factory",
    "dial_index_score",
    "dial_index_luminescence",
    "dial_index_luminescence_type",
    "dial_index_luminescence_score",
  ],
  dial_hands: [
    "dial_hands_type",
    "dial_hands_style",
    "dial_hands_factory",
    "dial_hands_score",
    "dial_hands_luminescence",
    "dial_hands_luminescence_type",
    "dial_hands_luminescence_score",
  ],
  movement: [
    "movement_type",
    "movement_functions",
    "movement_caliber_reference",
    "movement_caliber_factory",
  ],
  technical_movement: [
    "technical_movement_observed_daily_drift_action",
    "technical_movement_observed_daily_drift_value",
    "technical_movement_test_date",
    "technical_movement_test_result",
    "technical_movement_precision_score",
  ],
  technical_waterproofing: [
    "technical_waterproofing_test",
    "technical_waterproofing_test_date",
    "technical_waterproofing_tested_pressure",
    "technical_waterproofing_observed_leak",
    "technical_waterproofing_suspected_zones",
    "technical_waterproofing_case_deformation_score",
  ],
  technical_rust_corrosion: [
    "technical_rust_corrosion_presence",
    "technical_rust_corrosion_zones",
  ],
  technical_joint: [
    "technical_joint_presents",
    "technical_joint_states",
    "technical_joint_score",
  ],
  technical_lubrification: ["technical_lubrification_score"],
  history: ["history_origin_country"],
  documents: ["documents"],
};

export const createValidationSchema = (excludedFields: string[] = []) => {
  const schema: Record<string, any> = {};

  const isFieldRequired = (fieldName: string) =>
    !excludedFields.includes(fieldName);

  if (isFieldRequired("general_object_type")) {
    schema.general_object_type = Yup.string().required(
      "Le type d'objet est requis",
    );
  }
  if (isFieldRequired("general_object_brand")) {
    schema.general_object_brand = Yup.string().required(
      "La marque est requise",
    );
  }
  if (isFieldRequired("general_object_model")) {
    schema.general_object_model = Yup.string().required("Le modèle est requis");
  }
  if (isFieldRequired("general_object_reference")) {
    schema.general_object_reference = Yup.string().required(
      "La référence est requise",
    );
  }
  if (isFieldRequired("general_object_serial_number")) {
    schema.general_object_serial_number = Yup.string().required(
      "Le numéro de série est requis",
    );
  }
  if (isFieldRequired("general_comment")) {
    schema.general_comment = Yup.string().required(
      "Le commentaire général est requis",
    );
  }

  if (isFieldRequired("accessories_score")) {
    schema.accessories_score = Yup.number()
      .required("Le score des accessoires est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("accessories_images")) {
    schema.accessories_images = Yup.array()
      .min(1, "Au moins une image des accessoires est requise")
      .required("Les images des accessoires sont requises");
  }

  if (isFieldRequired("case_shape")) {
    schema.case_shape = Yup.string().required(
      "La forme du boîtier est requise",
    );
  }
  if (isFieldRequired("case_diameter.diameter")) {
    schema.case_diameter = Yup.object().shape({
      diameter: Yup.string().required("Le diamètre du boîtier est requis"),
    });
  }
  if (isFieldRequired("case_thickness")) {
    schema.case_thickness = Yup.string().required(
      "L'épaisseur du boîtier est requise",
    );
  }
  if (isFieldRequired("case_lug_width")) {
    schema.case_lug_width = Yup.string().required(
      "La largeur entre cornes est requise",
    );
  }
  if (isFieldRequired("case_material")) {
    schema.case_material = Yup.string().required(
      "Le matériau du boîtier est requis",
    );
  }
  if (isFieldRequired("case_factory")) {
    schema.case_factory = Yup.string().required(
      "L'origine du boîtier est requise",
    );
  }
  if (isFieldRequired("case_setting")) {
    schema.case_setting = Yup.string().required(
      "Le sertissage du boîtier est requis",
    );
  }
  if (isFieldRequired("case_setting_type")) {
    schema.case_setting_type = Yup.string().required(
      "Le type de sertissage du boîtier est requis",
    );
  }
  if (isFieldRequired("case_score")) {
    schema.case_score = Yup.number()
      .required("Le score du boîtier est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("case_images")) {
    schema.case_images = Yup.array()
      .min(1, "Au moins une image du boîtier est requise")
      .required("Les images du boîtier sont requises");
  }

  if (isFieldRequired("case_back_type")) {
    schema.case_back_type = Yup.string().required(
      "Le type de fond de boîte est requis",
    );
  }
  if (isFieldRequired("case_back_material")) {
    schema.case_back_material = Yup.string().required(
      "Le matériau du fond de boîte est requis",
    );
  }
  if (isFieldRequired("case_back_factory")) {
    schema.case_back_factory = Yup.string().required(
      "L'origine du fond de boîte est requise",
    );
  }
  if (isFieldRequired("case_back_score")) {
    schema.case_back_score = Yup.number()
      .required("Le score du fond de boîte est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("case_crown_type")) {
    schema.case_crown_type = Yup.string().required(
      "Le type de couronne est requis",
    );
  }
  if (isFieldRequired("case_crown_factory")) {
    schema.case_crown_factory = Yup.string().required(
      "L'origine de la couronne est requise",
    );
  }
  if (isFieldRequired("case_crown_score")) {
    schema.case_crown_score = Yup.number()
      .required("Le score de la couronne est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("case_crown_images")) {
    schema.case_crown_images = Yup.array()
      .min(1, "Au moins une image de la couronne est requise")
      .required("Les images de la couronne sont requises");
  }
  if (isFieldRequired("case_crown_pusher_factory")) {
    schema.case_crown_pusher_factory = Yup.string().required(
      "L'origine des poussoirs est requise",
    );
  }
  if (isFieldRequired("case_crown_pusher_score")) {
    schema.case_crown_pusher_score = Yup.number()
      .required("Le score des poussoirs est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("case_crown_pusher_images")) {
    schema.case_crown_pusher_images = Yup.array()
      .min(1, "Au moins une image du poussoir est requise")
      .required("Les images des poussoirs sont requises");
  }

  if (isFieldRequired("case_bezel_type")) {
    schema.case_bezel_type = Yup.string().required(
      "Le type de lunette est requis",
    );
  }
  if (isFieldRequired("case_bezel_material")) {
    schema.case_bezel_material = Yup.string().required(
      "Le matériau de la lunette est requis",
    );
  }
  if (isFieldRequired("case_bezel_factory")) {
    schema.case_bezel_factory = Yup.string().required(
      "L'origine de la lunette est requise",
    );
  }
  if (isFieldRequired("case_bezel_setting")) {
    schema.case_bezel_setting = Yup.string().required(
      "Le sertissage de la lunette est requis",
    );
  }
  if (isFieldRequired("case_bezel_setting_type")) {
    schema.case_bezel_setting_type = Yup.string().required(
      "Le type de sertissage de la lunette est requis",
    );
  }
  if (isFieldRequired("case_bezel_score")) {
    schema.case_bezel_score = Yup.number()
      .required("Le score de la lunette est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("case_bezel_images")) {
    schema.case_bezel_images = Yup.array()
      .min(1, "Au moins une image de la lunette est requise")
      .required("Les images de la lunette sont requises");
  }

  if (isFieldRequired("case_bezel_insert_material")) {
    schema.case_bezel_insert_material = Yup.string().required(
      "Le matériau de l'insert est requis",
    );
  }
  if (isFieldRequired("case_bezel_insert_factory")) {
    schema.case_bezel_insert_factory = Yup.string().required(
      "L'origine de l'insert est requise",
    );
  }
  if (isFieldRequired("case_bezel_insert_score")) {
    schema.case_bezel_insert_score = Yup.number()
      .required("Le score de l'insert est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("case_glass_material")) {
    schema.case_glass_material = Yup.string().required(
      "Le matériau du verre est requis",
    );
  }
  if (isFieldRequired("case_glass_factory")) {
    schema.case_glass_factory = Yup.string().required(
      "L'origine du verre est requise",
    );
  }
  if (isFieldRequired("case_glass_score")) {
    schema.case_glass_score = Yup.number()
      .required("Le score du verre est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("bracelet_type")) {
    schema.bracelet_type = Yup.string().required(
      "Le type de bracelet est requis",
    );
  }

  if (isFieldRequired("bracelet_diameter.length")) {
    schema.bracelet_diameter = Yup.object().shape({
      length: Yup.string().required("La longueur du bracelet est requise"),
    });
  }
  if (isFieldRequired("bracelet_diameter.width")) {
    schema.bracelet_diameter = Yup.object().shape({
      width: Yup.string().required("La largeur du bracelet est requise"),
    });
  }
  if (isFieldRequired("bracelet_diameter.thickness")) {
    schema.bracelet_diameter = Yup.object().shape({
      thickness: Yup.string().required("L'épaisseur du bracelet est requise"),
    });
  }
  if (isFieldRequired("bracelet_material")) {
    schema.bracelet_material = Yup.string().required(
      "Le matériau du bracelet est requis",
    );
  }
  if (isFieldRequired("bracelet_factory")) {
    schema.bracelet_factory = Yup.string().required(
      "L'origine du bracelet est requise",
    );
  }
  if (isFieldRequired("bracelet_setting")) {
    schema.bracelet_setting = Yup.string().required(
      "Le sertissage du bracelet est requis",
    );
  }
  if (isFieldRequired("bracelet_setting_type")) {
    schema.bracelet_setting_type = Yup.string().required(
      "Le type de sertissage du bracelet est requis",
    );
  }
  if (isFieldRequired("bracelet_score")) {
    schema.bracelet_score = Yup.number()
      .required("Le score du bracelet est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("bracelet_images")) {
    schema.bracelet_images = Yup.array()
      .min(1, "Au moins une image du bracelet est requise")
      .required("Les images du bracelet sont requises");
  }

  if (isFieldRequired("bracelet_clasp_type")) {
    schema.bracelet_clasp_type = Yup.string().required(
      "Le type de fermoir est requis",
    );
  }
  if (isFieldRequired("bracelet_clasp_material")) {
    schema.bracelet_clasp_material = Yup.string().required(
      "Le matériau du fermoir est requis",
    );
  }
  if (isFieldRequired("bracelet_clasp_factory")) {
    schema.bracelet_clasp_factory = Yup.string().required(
      "L'origine du fermoir est requise",
    );
  }
  if (isFieldRequired("bracelet_clasp_setting")) {
    schema.bracelet_clasp_setting = Yup.string().required(
      "Le sertissage du fermoir est requis",
    );
  }
  if (isFieldRequired("bracelet_clasp_setting_type")) {
    schema.bracelet_clasp_setting_type = Yup.string().required(
      "Le type de sertissage du fermoir est requis",
    );
  }
  if (isFieldRequired("bracelet_clasp_score")) {
    schema.bracelet_clasp_score = Yup.number()
      .required("Le score du fermoir est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("bracelet_clasp_images")) {
    schema.bracelet_clasp_images = Yup.array()
      .min(1, "Au moins une image du fermoir est requise")
      .required("Les images du fermoir sont requises");
  }

  if (isFieldRequired("bracelet_link_pump_type")) {
    schema.bracelet_link_pump_type = Yup.string().required(
      "Le type de maillons de fin est requis",
    );
  }
  if (isFieldRequired("bracelet_link_factory")) {
    schema.bracelet_link_factory = Yup.string().required(
      "L'origine des maillons de fin est requise",
    );
  }

  if (isFieldRequired("dial_type")) {
    schema.dial_type = Yup.string().required("Le type de cadran est requis");
  }
  if (isFieldRequired("dial_color")) {
    schema.dial_color = Yup.string().required(
      "La couleur du cadran est requise",
    );
  }
  if (isFieldRequired("dial_patina_score")) {
    schema.dial_patina_score = Yup.number()
      .required("Le score de la patine est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("dial_factory")) {
    schema.dial_factory = Yup.string().required(
      "L'origine du cadran est requise",
    );
  }
  if (isFieldRequired("dial_setting")) {
    schema.dial_setting = Yup.string().required(
      "Le sertissage du cadran est requis",
    );
  }
  if (isFieldRequired("dial_setting_type")) {
    schema.dial_setting_type = Yup.string().required(
      "Le type de sertissage du cadran est requis",
    );
  }
  if (isFieldRequired("dial_score")) {
    schema.dial_score = Yup.number()
      .required("Le score du cadran est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("dial_images")) {
    schema.dial_images = Yup.array()
      .min(1, "Au moins une image du cadran est requise")
      .required("Les images du cadran sont requises");
  }

  if (isFieldRequired("dial_index_type")) {
    schema.dial_index_type = Yup.string().required(
      "Le type d'index est requis",
    );
  }
  if (isFieldRequired("dial_index_style")) {
    schema.dial_index_style = Yup.string().required(
      "Le style d'index est requis",
    );
  }
  if (isFieldRequired("dial_index_factory")) {
    schema.dial_index_factory = Yup.string().required(
      "L'origine des index est requise",
    );
  }
  if (isFieldRequired("dial_index_score")) {
    schema.dial_index_score = Yup.number()
      .required("Le score des index est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("dial_index_luminescence")) {
    schema.dial_index_luminescence = Yup.string().required(
      "La luminescence des index est requise",
    );
  }
  if (isFieldRequired("dial_index_luminescence_type")) {
    schema.dial_index_luminescence_type = Yup.string().required(
      "Le type de luminescence des index est requis",
    );
  }
  if (isFieldRequired("dial_index_luminescence_score")) {
    schema.dial_index_luminescence_score = Yup.number()
      .required("Le score de luminescence des index est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("dial_hands_type")) {
    schema.dial_hands_type = Yup.string().required(
      "Le type d'aiguilles est requis",
    );
  }
  if (isFieldRequired("dial_hands_style")) {
    schema.dial_hands_style = Yup.string().required(
      "Le style d'aiguilles est requis",
    );
  }
  if (isFieldRequired("dial_hands_factory")) {
    schema.dial_hands_factory = Yup.string().required(
      "L'origine des aiguilles est requise",
    );
  }
  if (isFieldRequired("dial_hands_score")) {
    schema.dial_hands_score = Yup.number()
      .required("Le score des aiguilles est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("dial_hands_luminescence")) {
    schema.dial_hands_luminescence = Yup.string().required(
      "La luminescence des aiguilles est requise",
    );
  }
  if (isFieldRequired("dial_hands_luminescence_type")) {
    schema.dial_hands_luminescence_type = Yup.string().required(
      "Le type de luminescence des aiguilles est requis",
    );
  }
  if (isFieldRequired("dial_hands_luminescence_score")) {
    schema.dial_hands_luminescence_score = Yup.number()
      .required("Le score de luminescence des aiguilles est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("movement_type")) {
    schema.movement_type = Yup.string().required(
      "Le type de mouvement est requis",
    );
  }
  if (isFieldRequired("movement_functions")) {
    schema.movement_functions = Yup.string().required(
      "Les fonctions du mouvement sont requises",
    );
  }
  if (isFieldRequired("movement_caliber_reference")) {
    schema.movement_caliber_reference = Yup.string().required(
      "La référence du calibre est requise",
    );
  }
  if (isFieldRequired("movement_caliber_factory")) {
    schema.movement_caliber_factory = Yup.string().required(
      "L'origine du calibre est requise",
    );
  }

  if (isFieldRequired("technical_movement_observed_daily_drift_action")) {
    schema.technical_movement_observed_daily_drift_action =
      Yup.string().required("L'action de dérive quotidienne est requise");
  }
  if (isFieldRequired("technical_movement_observed_daily_drift_value")) {
    schema.technical_movement_observed_daily_drift_value =
      Yup.number().required("La valeur de dérive quotidienne est requise");
  }
  if (isFieldRequired("technical_movement_test_date")) {
    schema.technical_movement_test_date = Yup.string().required(
      "La date du test du mouvement est requise",
    );
  }
  if (isFieldRequired("technical_movement_test_result")) {
    schema.technical_movement_test_result = Yup.mixed().required(
      "Le résultat du test du mouvement est requis",
    );
  }
  if (isFieldRequired("technical_movement_precision_score")) {
    schema.technical_movement_precision_score = Yup.number()
      .required("Le score de précision est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("technical_waterproofing_test")) {
    schema.technical_waterproofing_test = Yup.string().required(
      "Le test d'étanchéité est requis",
    );
  }
  if (isFieldRequired("technical_waterproofing_test_date")) {
    schema.technical_waterproofing_test_date = Yup.string().required(
      "La date du test d'étanchéité est requise",
    );
  }
  if (isFieldRequired("technical_waterproofing_tested_pressure")) {
    schema.technical_waterproofing_tested_pressure = Yup.number()
      .required("La pression testée est requise")
      .min(0, "La pression doit être positive");
  }
  if (isFieldRequired("technical_waterproofing_observed_leak")) {
    schema.technical_waterproofing_observed_leak = Yup.string().required(
      "Les fuites observées sont requises",
    );
  }
  if (isFieldRequired("technical_waterproofing_suspected_zones")) {
    schema.technical_waterproofing_suspected_zones = Yup.string().required(
      "Les zones suspectées sont requises",
    );
  }
  if (isFieldRequired("technical_waterproofing_case_deformation_score")) {
    schema.technical_waterproofing_case_deformation_score = Yup.number()
      .required("Le score de déformation du boîtier est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("technical_rust_corrosion_presence")) {
    schema.technical_rust_corrosion_presence = Yup.string().required(
      "La présence de rouille/corrosion est requise",
    );
  }
  if (isFieldRequired("technical_rust_corrosion_zones")) {
    schema.technical_rust_corrosion_zones = Yup.string().required(
      "Les zones de rouille/corrosion sont requises",
    );
  }

  if (isFieldRequired("technical_joint_presents")) {
    schema.technical_joint_presents = Yup.string().required(
      "La présence des joints est requise",
    );
  }
  if (isFieldRequired("technical_joint_states")) {
    schema.technical_joint_states = Yup.string().required(
      "L'état des joints est requis",
    );
  }
  if (isFieldRequired("technical_joint_score")) {
    schema.technical_joint_score = Yup.number()
      .required("Le score des joints est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }

  if (isFieldRequired("technical_lubrification_score")) {
    schema.technical_lubrification_score = Yup.number()
      .required("Le score de lubrification est requis")
      .min(0, "Le score doit être entre 0 et 10")
      .max(10, "Le score doit être entre 0 et 10");
  }
  if (isFieldRequired("technical_lubrification_movement")) {
    schema.technical_lubrification_movement = Yup.string().required(
      "La lubrification du mouvement est requis",
    );
  }
  if (isFieldRequired("technical_lubrification_join")) {
    schema.technical_lubrification_join = Yup.string().required(
      "La lubrification des joints est requis",
    );
  }

  if (isFieldRequired("documents")) {
    schema.documents = Yup.array()
      .min(1, "Au moins un document est requis")
      .required("Les documents sont requis");
  }

  return Yup.object().shape(schema);
};
