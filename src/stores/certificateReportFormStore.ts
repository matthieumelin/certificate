import type { Document } from "@/types/file";
import type { FormValidationError } from "@/types/form";
import { ObjectStatus } from "@/types/object.d";
import { create } from "zustand";

interface FormState {
  // Accessoires
  accessories_factory: string[];
  accessories_factory_not: string[];
  accessories_score: number;
  accessories_comment: string;
  accessories_images: string[];

  // Bracelet - Fermoir
  bracelet_clasp_type: string;
  bracelet_clasp_material: string;
  bracelet_clasp_surface_plated: string;
  bracelet_clasp_hallmark: string;
  bracelet_clasp_signature: string;
  bracelet_clasp_serial_number: string;
  bracelet_clasp_reference: string;
  bracelet_clasp_factory: string;
  bracelet_clasp_change: string;
  bracelet_clasp_change_date: string;
  bracelet_clasp_custom: string;
  bracelet_clasp_custom_date: string;
  bracelet_clasp_setting: string;
  bracelet_clasp_setting_type: string;
  bracelet_clasp_setting_factory: string;
  bracelet_clasp_setting_date: string;
  bracelet_clasp_score: number;
  bracelet_clasp_comment: string;
  bracelet_clasp_images: string[];

  // Bracelet - End links
  bracelet_link_pump_type: string;
  bracelet_link_serial_number: string;
  bracelet_link_factory: string;
  bracelet_link_reference: string;

  // Bracelet - Principal
  bracelet_type: string;
  bracelet_diameter: {
    length: string;
    width: string;
    thickness: string;
  };
  bracelet_material: string;
  bracelet_surface_plated: string;
  bracelet_hallmark: string;
  bracelet_signature: string;
  bracelet_serial_number: string;
  bracelet_reference: string;
  bracelet_factory: string;
  bracelet_change: string;
  bracelet_change_date: string;
  bracelet_custom: string;
  bracelet_custom_date: string;
  bracelet_setting: string;
  bracelet_setting_type: string;
  bracelet_setting_factory: string;
  bracelet_setting_date: string;
  bracelet_score: number;
  bracelet_comment: string;
  bracelet_images: string[];

  // Boîtier - Fond
  case_back_type: string;
  case_back_material: string;
  case_back_hallmark: string;
  case_back_signature: string;
  case_back_serial_number: string;
  case_back_reference: string;
  case_back_factory: string;
  case_back_change: string;
  case_back_change_date: string;
  case_back_custom: string;
  case_back_custom_date: string;
  case_back_score: number;
  case_back_comment: string;
  case_back_images: string[];

  // Boîtier - Insert de lunette
  case_bezel_insert_material: string;
  case_bezel_insert_serial_number: string;
  case_bezel_insert_reference: string;
  case_bezel_insert_factory: string;
  case_bezel_insert_change: string;
  case_bezel_insert_change_date: string;
  case_bezel_insert_custom: string;
  case_bezel_insert_custom_date: string;
  case_bezel_insert_score: number;
  case_bezel_insert_comment: string;

  // Boîtier - Lunette
  case_bezel_type: string;
  case_bezel_material: string;
  case_bezel_texture: string;
  case_bezel_surface_plated: string;
  case_bezel_factory: string;
  case_bezel_change: string;
  case_bezel_change_date: string;
  case_bezel_custom: string;
  case_bezel_custom_date: string;
  case_bezel_score: number;
  case_bezel_comment: string;
  case_bezel_images: string[];
  case_bezel_setting: string;
  case_bezel_setting_type: string;
  case_bezel_setting_factory: string;
  case_bezel_setting_date: string;

  // Boîtier - Couronne
  case_crown_type: string;
  case_crown_score: number;
  case_crown_pusher: number;
  case_crown_comment: string;
  case_crown_images: string[];
  case_crown_factory: string;
  case_crown_change: string;
  case_crown_change_date: string;
  case_crown_custom: string;
  case_crown_custom_date: string;

  // Boîtier - Poussoir
  case_crown_pusher_score: number;
  case_crown_pusher_comment: string;
  case_crown_pusher_images: string[];
  case_crown_pusher_factory: string;
  case_crown_pusher_change: string;
  case_crown_pusher_change_date: string;
  case_crown_pusher_custom: string;
  case_crown_pusher_custom_date: string;

  // Boîtier - Verre
  case_glass_material: string;
  case_glass_factory: string;
  case_glass_change: string;
  case_glass_change_date: string;
  case_glass_score: number;
  case_glass_comment: string;

  // Boîtier - Principal
  case_shape: string;
  case_diameter: {
    length: string;
    width: string;
    diameter: string;
  };
  case_material: string;
  case_surface_plated: string;
  case_hallmark: string;
  case_signature: string;
  case_thickness: string;
  case_serial_number: string;
  case_reference: string;
  case_factory: string;
  case_change: string;
  case_change_date: string;
  case_custom: string;
  case_custom_date: string;
  case_setting: string;
  case_setting_type: string;
  case_setting_factory: string;
  case_setting_date: string;
  case_score: number;
  case_comment: string;
  case_images: string[];
  case_lug_width: string;

  // Cadran - Aiguilles
  dial_hands_type: string;
  dial_hands_style: string;
  dial_hands_material: string;
  dial_hands_color: string;
  dial_hands_factory: string;
  dial_hands_score: number;
  dial_hands_comment: string;
  dial_hands_images: string[];
  dial_hands_luminescence: string;
  dial_hands_luminescence_type: string;
  dial_hands_luminescence_factory: string;
  dial_hands_luminescence_change: string;
  dial_hands_luminescence_change_date: string;
  dial_hands_luminescence_score: number;
  dial_hands_luminescence_comment: string;
  dial_hands_custom: string;
  dial_hands_custom_date: string;
  dial_hands_change: string;
  dial_hands_change_date: string;

  // Cadran - Index
  dial_index_type: string;
  dial_index_style: string;
  dial_index_material: string;
  dial_index_color: string;
  dial_index_factory: string;
  dial_index_change: string;
  dial_index_change_date: string;
  dial_index_custom: string;
  dial_index_custom_date: string;
  dial_index_serial_number: string;
  dial_index_score: number;
  dial_index_comment: string;
  dial_index_luminescence: string;
  dial_index_luminescence_type: string;
  dial_index_luminescence_factory: string;
  dial_index_luminescence_change: string;
  dial_index_luminescence_change_date: string;
  dial_index_luminescence_score: number;
  dial_index_luminescence_comment: string;

  // Cadran - Principal
  dial_type: string;
  dial_material: string;
  dial_color: string;
  dial_texture: string;
  dial_finishing: string;
  dial_signature: string;
  dial_patina: string;
  dial_patina_score: number;
  dial_score: number;
  dial_serial_number: string;
  dial_reference: string;
  dial_surname: string;
  dial_factory: string;
  dial_change: string;
  dial_change_date: string;
  dial_custom: string;
  dial_custom_date: string;
  dial_setting: string;
  dial_setting_date: string;
  dial_setting_type: string;
  dial_setting_factory: string;
  dial_comment: string;
  dial_images: string[];

  // Documents
  documents: Document[];

  // Général
  general_object_type: string;
  general_object_brand: string;
  general_object_model: string;
  general_object_reference: string;
  general_object_surname: string;
  general_object_serial_number: string;
  general_object_year: number;
  general_object_status: ObjectStatus;

  general_comment: string;

  // Historique
  history_origin_country: string;
  history_purchase_country_seller: string;
  history_purchase_country_date: string;
  history_purchase_buying_price: number;
  history_actual_country: string;

  // Mouvement
  movement_type: string;
  movement_functions: string;
  movement_serial_number: string;
  movement_caliber_reference: string;
  movement_caliber_base: string;
  movement_caliber_factory: string;
  movement_caliber_change: string;
  movement_gems_number: number;
  movement_power_reserve_announced: number;
  movement_announced_amplitude: number;
  movement_announced_frequency_hz: number;
  movement_announced_frequency_ah: number;
  movement_pieces_change: string;
  movement_pieces_change_date: string;

  // Réparation
  repair_type: string;
  repair_place: string;
  repair_workshop: string;
  repair_date: string;

  // Technique - Joints
  technical_joint_presents: string;
  technical_joint_types: string;
  technical_joint_materials: string;
  technical_joint_states: string;
  technical_joint_flexibility: string;
  technical_joint_score: number;

  // Technique - Lubrification
  technical_lubrification_movement: string;
  technical_lubrification_join: string;
  technical_lubrification_score: number;

  // Technique - Mouvement
  technical_movement_power_reserve_observed: number;
  technical_movement_observed_amplitude: number;
  technical_movement_observed_daily_drift_action: string;
  technical_movement_observed_daily_drift_value: number;
  technical_movement_test_date: string;
  technical_movement_test_result: string[];
  technical_movement_precision_score: number;

  // Technique - Rouille et corrosion
  technical_rust_corrosion_presence: string;
  technical_rust_corrosion_zones: string;
  technical_rust_corrosion_images: string[];

  // Technique - Étanchéité
  technical_waterproofing_test: string;
  technical_waterproofing_test_date: string;
  technical_waterproofing_test_result: string[];
  technical_waterproofing_resistance: string;
  technical_waterproofing_tested_pressure: number;
  technical_waterproofing_observed_leak: string;
  technical_waterproofing_suspected_zones: string;
  technical_waterproofing_case_deformation_before_test: number;
  technical_waterproofing_case_deformation_after_test: number;
  technical_waterproofing_case_deformation_variation: number;
  technical_waterproofing_case_deformation_score: number;

  // Technique - Poids
  technical_weight_total_watch: number;
  technical_weight_case: number;
  technical_weight_bracelet: number;
  technical_weight_movement: number;
  technical_weight_power_reserve_observed: number;
  technical_weight_observed_amplitude: number;
  technical_weight_observed_daily_drift_action: string;
  technical_weight_observed_daily_drift_value: number;
  technical_weight_precision_score: number;
  technical_weight_images: string[];

  // Valeur
  value_market: number;
  value_real: number;
  value_estimated: number;
  value_liquidity_score: number;
}

interface CertificateReportFormStore {
  formData: FormState;
  validationErrors: FormValidationError[];
  updateFormData: (data: Partial<FormState>) => void;
  getAllFormData: () => FormState;
  resetFormData: () => void;
  loadInitialData: (data: Partial<FormState>) => void;
  setValidationErrors: (errors: FormValidationError[]) => void;
  clearValidationErrors: () => void;
  hasErrors: () => boolean;
}

const initialFormState: FormState = {
  // Accessoires
  accessories_factory: [],
  accessories_factory_not: [],
  accessories_score: 0,
  accessories_comment: "",
  accessories_images: [],

  // Bracelet - Fermoir
  bracelet_clasp_type: "",
  bracelet_clasp_material: "",
  bracelet_clasp_surface_plated: "",
  bracelet_clasp_hallmark: "",
  bracelet_clasp_signature: "",
  bracelet_clasp_serial_number: "",
  bracelet_clasp_reference: "",
  bracelet_clasp_factory: "",
  bracelet_clasp_change: "",
  bracelet_clasp_change_date: "",
  bracelet_clasp_custom: "",
  bracelet_clasp_custom_date: "",
  bracelet_clasp_setting: "",
  bracelet_clasp_setting_type: "",
  bracelet_clasp_setting_factory: "",
  bracelet_clasp_setting_date: "",
  bracelet_clasp_score: 0,
  bracelet_clasp_comment: "",
  bracelet_clasp_images: [],

  // Bracelet - End links
  bracelet_link_pump_type: "",
  bracelet_link_serial_number: "",
  bracelet_link_factory: "",
  bracelet_link_reference: "",

  // Bracelet - Principal
  bracelet_type: "",
  bracelet_diameter: { length: "", width: "", thickness: "" },
  bracelet_material: "",
  bracelet_surface_plated: "",
  bracelet_hallmark: "",
  bracelet_signature: "",
  bracelet_serial_number: "",
  bracelet_reference: "",
  bracelet_factory: "",
  bracelet_change: "",
  bracelet_change_date: "",
  bracelet_custom: "",
  bracelet_custom_date: "",
  bracelet_setting: "",
  bracelet_setting_type: "",
  bracelet_setting_factory: "",
  bracelet_setting_date: "",
  bracelet_score: 0,
  bracelet_comment: "",
  bracelet_images: [],

  // Boîtier - Fond
  case_back_type: "",
  case_back_material: "",
  case_back_hallmark: "",
  case_back_signature: "",
  case_back_serial_number: "",
  case_back_reference: "",
  case_back_factory: "",
  case_back_change: "",
  case_back_change_date: "",
  case_back_custom: "",
  case_back_custom_date: "",
  case_back_score: 0,
  case_back_comment: "",
  case_back_images: [],

  // Boîtier - Insert de lunette
  case_bezel_insert_material: "",
  case_bezel_insert_serial_number: "",
  case_bezel_insert_reference: "",
  case_bezel_insert_factory: "",
  case_bezel_insert_change: "",
  case_bezel_insert_change_date: "",
  case_bezel_insert_custom: "",
  case_bezel_insert_custom_date: "",
  case_bezel_insert_score: 0,
  case_bezel_insert_comment: "",

  // Boîtier - Lunette
  case_bezel_type: "",
  case_bezel_material: "",
  case_bezel_texture: "",
  case_bezel_surface_plated: "",
  case_bezel_factory: "",
  case_bezel_change: "",
  case_bezel_change_date: "",
  case_bezel_custom: "",
  case_bezel_custom_date: "",
  case_bezel_score: 0,
  case_bezel_comment: "",
  case_bezel_images: [],
  case_bezel_setting: "",
  case_bezel_setting_type: "",
  case_bezel_setting_factory: "",
  case_bezel_setting_date: "",

  // Boîtier - Couronne
  case_crown_type: "",
  case_crown_score: 0,
  case_crown_pusher: 0,
  case_crown_comment: "",
  case_crown_images: [],
  case_crown_factory: "",
  case_crown_change: "",
  case_crown_change_date: "",
  case_crown_custom: "",
  case_crown_custom_date: "",

  // Boîtier - Poussoir
  case_crown_pusher_score: 0,
  case_crown_pusher_comment: "",
  case_crown_pusher_images: [],
  case_crown_pusher_factory: "",
  case_crown_pusher_change: "",
  case_crown_pusher_change_date: "",
  case_crown_pusher_custom: "",
  case_crown_pusher_custom_date: "",

  // Boîtier - Verre
  case_glass_material: "",
  case_glass_factory: "",
  case_glass_change: "",
  case_glass_change_date: "",
  case_glass_score: 0,
  case_glass_comment: "",

  // Boîtier - Principal
  case_shape: "",
  case_diameter: { length: "", width: "", diameter: "" },
  case_material: "",
  case_surface_plated: "",
  case_hallmark: "",
  case_signature: "",
  case_thickness: "",
  case_serial_number: "",
  case_reference: "",
  case_factory: "",
  case_change: "",
  case_change_date: "",
  case_custom: "",
  case_custom_date: "",
  case_setting: "",
  case_setting_type: "",
  case_setting_factory: "",
  case_setting_date: "",
  case_score: 0,
  case_comment: "",
  case_images: [],
  case_lug_width: "",

  // Cadran - Aiguilles
  dial_hands_type: "",
  dial_hands_style: "",
  dial_hands_material: "",
  dial_hands_color: "",
  dial_hands_factory: "",
  dial_hands_score: 0,
  dial_hands_comment: "",
  dial_hands_images: [],
  dial_hands_luminescence: "",
  dial_hands_luminescence_type: "",
  dial_hands_luminescence_factory: "",
  dial_hands_luminescence_change: "",
  dial_hands_luminescence_change_date: "",
  dial_hands_luminescence_score: 0,
  dial_hands_luminescence_comment: "",
  dial_hands_custom: "",
  dial_hands_custom_date: "",
  dial_hands_change: "",
  dial_hands_change_date: "",

  // Cadran - Index
  dial_index_type: "",
  dial_index_style: "",
  dial_index_material: "",
  dial_index_color: "",
  dial_index_factory: "",
  dial_index_change: "",
  dial_index_change_date: "",
  dial_index_custom: "",
  dial_index_custom_date: "",
  dial_index_serial_number: "",
  dial_index_score: 0,
  dial_index_comment: "",
  dial_index_luminescence: "",
  dial_index_luminescence_type: "",
  dial_index_luminescence_factory: "",
  dial_index_luminescence_change: "",
  dial_index_luminescence_change_date: "",
  dial_index_luminescence_score: 0,
  dial_index_luminescence_comment: "",

  // Cadran - Principal
  dial_type: "",
  dial_material: "",
  dial_color: "",
  dial_texture: "",
  dial_finishing: "",
  dial_signature: "",
  dial_patina: "",
  dial_patina_score: 0,
  dial_score: 0,
  dial_serial_number: "",
  dial_reference: "",
  dial_surname: "",
  dial_factory: "",
  dial_change: "",
  dial_change_date: "",
  dial_custom: "",
  dial_custom_date: "",
  dial_setting: "",
  dial_setting_date: "",
  dial_setting_type: "",
  dial_setting_factory: "",
  dial_comment: "",
  dial_images: [],

  // Documents
  documents: [],

  // Général
  general_object_type: "",
  general_object_brand: "",
  general_object_model: "",
  general_object_reference: "",
  general_object_surname: "",
  general_object_serial_number: "",
  general_object_year: 0,
  general_object_status: ObjectStatus.Valid,

  general_comment: "",

  // Historique
  history_origin_country: "",
  history_purchase_country_seller: "",
  history_purchase_country_date: "",
  history_purchase_buying_price: 0,
  history_actual_country: "",

  // Mouvement
  movement_type: "",
  movement_functions: "",
  movement_serial_number: "",
  movement_caliber_reference: "",
  movement_caliber_base: "",
  movement_caliber_factory: "",
  movement_caliber_change: "",
  movement_gems_number: 0,
  movement_power_reserve_announced: 0,
  movement_announced_amplitude: 0,
  movement_announced_frequency_hz: 0,
  movement_announced_frequency_ah: 0,
  movement_pieces_change: "",
  movement_pieces_change_date: "",

  // Réparation
  repair_type: "",
  repair_place: "",
  repair_workshop: "",
  repair_date: "",

  // Technique - Joints
  technical_joint_presents: "",
  technical_joint_types: "",
  technical_joint_materials: "",
  technical_joint_states: "",
  technical_joint_flexibility: "",
  technical_joint_score: 0,

  // Technique - Lubrification
  technical_lubrification_movement: "",
  technical_lubrification_join: "",
  technical_lubrification_score: 0,

  // Technique - Mouvement
  technical_movement_power_reserve_observed: 0,
  technical_movement_observed_amplitude: 0,
  technical_movement_observed_daily_drift_action: "",
  technical_movement_observed_daily_drift_value: 0,
  technical_movement_test_date: "",
  technical_movement_test_result: [],
  technical_movement_precision_score: 0,

  // Technique - Rouille et corrosion
  technical_rust_corrosion_presence: "",
  technical_rust_corrosion_zones: "",
  technical_rust_corrosion_images: [],

  // Technique - Étanchéité
  technical_waterproofing_test: "",
  technical_waterproofing_test_date: "",
  technical_waterproofing_test_result: [],
  technical_waterproofing_resistance: "",
  technical_waterproofing_tested_pressure: 0,
  technical_waterproofing_observed_leak: "",
  technical_waterproofing_suspected_zones: "",
  technical_waterproofing_case_deformation_before_test: 0,
  technical_waterproofing_case_deformation_after_test: 0,
  technical_waterproofing_case_deformation_variation: 0,
  technical_waterproofing_case_deformation_score: 0,

  // Technique - Poids
  technical_weight_total_watch: 0,
  technical_weight_case: 0,
  technical_weight_bracelet: 0,
  technical_weight_movement: 0,
  technical_weight_power_reserve_observed: 0,
  technical_weight_observed_amplitude: 0,
  technical_weight_observed_daily_drift_action: "",
  technical_weight_observed_daily_drift_value: 0,
  technical_weight_precision_score: 0,
  technical_weight_images: [],

  // Valeur
  value_market: 0,
  value_real: 0,
  value_estimated: 0,
  value_liquidity_score: 0,
};

export const useCertificateReportFormStore = create<CertificateReportFormStore>(
  (set, get) => ({
    formData: initialFormState,
    validationErrors: [],
    updateFormData: (data) => {
      set((state) => ({
        formData: {
          ...state.formData,
          ...data,
        },
      }));
    },
    getAllFormData: () => get().formData,
    resetFormData: () => set({ formData: initialFormState }),
    loadInitialData: (data) => {
      set((state) => ({
        formData: {
          ...state.formData,
          ...data,
        },
      }));
    },
    setValidationErrors: (errors) => set({ validationErrors: errors }),
    clearValidationErrors: () => set({ validationErrors: [] }),
    hasErrors: () => get().validationErrors.length > 0,
  }),
);
