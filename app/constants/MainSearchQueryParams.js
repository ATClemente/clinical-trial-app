// Constants involved in querying API, and the property names in the response

// Query Parameters
export const SIZE_STR = 'size';
export const FROM_STR = 'from';
export const CURRENT_TRIAL_STATUS_STR = 'current_trial_status';
export const PURPOSE_CODE_STR = 'primary_purpose.primary_purpose_code';
export const POSTAL_CODE_STR = 'sites.org_postal_code';
export const DISTANCE_STR = 'sites.org_coordinates_dist';
export const GENDER_STR = 'eligibility.structured.gender';
export const KEYWORD_STR = '_fulltext';
export const INCLUDE_STR = 'include';

// Main Attributes to return from API:
export const NCT_ID = 'nct_id';
export const ASSOCIATED_STUDIES = 'associated_studies';
export const START_DATE = 'start_date';
export const COMPLETION_DATE = 'completion_date';
export const BRIEF_TITLE = 'brief_title';
export const BRIEF_SUMMARY = 'brief_summary';
export const PHASE = 'phase';
export const PRINCIPAL_INVESTIGATOR = 'principal_investigator';
export const CENTRAL_CONTACT = 'central_contact';
export const LEAD_ORG = 'lead_org';
export const SITES_ORG_NAME = 'sites.org_name';
export const SITES_CONTACT_NAME = 'sites.contact_name';
export const SITES_CONTACT_PHONE = 'sites.contact_phone';
export const SITES_CONTACT_EMAIL = 'sites.contact_email';
export const SITES_ORG_EMAIL = 'sites.org_email';
export const SITES_ORG_ADDRESS_LINE_1 = 'sites.org_address_line_1';
export const SITES_ORG_ADDRESS_LINE_2 = 'sites.org_address_line_2';
export const SITES_ORG_CITY = 'sites.org_city';
export const SITES_ORG_STATE_OR_PROVINCE = 'sites.org_state_or_province';
export const SITES_ORG_POSTAL_CODE = 'sites.org_postal_code';
export const SITES_ORG_CORRDINATES = 'sites.org_coordinates';
export const SITES_ORG_STATUS = 'sites.org_status';
export const SITES_ORG_RECRUIT_STATUS = 'sites.recruitment_status';
export const DISEASES_DISEASE_CODE = 'diseases.disease_code';
export const DISEASES_NCI_THESAURUS_CONCEPT_ID =
  'diseases.nci_thesaurus_concept_id';
export const DISEASES_PREFERRED_NAME = 'diseases.preferred_name';
export const ELIGIBILITY = 'eligibility';

// Other attributes (part of another Object or Object name returned from API):
export const CENTRAL_CONTACT_EMAIL = 'central_contact_email';
export const CENTRAL_CONTACT_NAME = 'central_contact_name';
export const CENTRAL_CONTACT_PHONE = 'central_contact_phone';
export const CENTRAL_CONTACT_TYPE = 'central_contact_type';

export const DISEASES = 'diseases';
export const DISEASE_CODE = 'disease_code';
export const NCI_THESAURUS_CONCEPT_ID = 'nci_thesaurus_concept_id';
export const PREFERRED_NAME = 'preferred_name';

export const STRUCTURED = 'structured';
export const GENDER = 'gender';
export const MAX_AGE = 'max_age';
export const MAX_AGE_IN_YEARS = 'max_age_in_years';
export const MAX_AGE_NUMBER = 'max_age_number';
export const MAX_AGE_UNIT = 'max_age_unit';
export const MIN_AGE = 'min_age';
export const MIN_AGE_IN_YEARS = 'min_age_in_years';
export const MIN_AGE_NUMBER = 'min_age_number';
export const MIN_AGE_UNIT = 'min_age_unit';

export const UNSTRUCTURED = 'unstructured';
export const DESCRIPTION = 'description';
export const DISPLAY_ORDER = 'display_order';
export const INCLUSION_INDICATOR = 'inclusion_indicator';

export const PHASE_ADDITIONAL_QUALIFIER_CODE =
  'phase_additional_qualifier_code';
export const PHASE_OTHER_TEXT = 'phase_other_text';

export const SITES = 'sites';
export const ORG_NAME = 'org_name';
export const CONTACT_NAME = 'contact_name';
export const CONTACT_PHONE = 'contact_phone';
export const CONTACT_EMAIL = "contact_email";
export const ORG_EMAIL = 'org_email';
export const ORG_ADDRESS_LINE_1 = 'org_address_line_1';
export const ORG_ADDRESS_LINE_2 = 'org_address_line_2';
export const ORG_CITY = 'org_city';
export const ORG_STATE_OR_PROVINCE = 'org_state_or_province';
export const ORG_POSTAL_CODE = 'org_postal_code';
export const ORG_CORRDINATES = 'org_coordinates';
export const ORG_STATUS = 'org_status';
export const RECRUIT_STATUS = 'recruitment_status';
export const LAT = 'lat';
export const LON = 'lon';

// Array of the main attributes to return from API:
export const INCLUDE_ARR = [
  NCT_ID,
  ASSOCIATED_STUDIES,
  START_DATE,
  COMPLETION_DATE,
  BRIEF_TITLE,
  BRIEF_SUMMARY,
  PHASE,
  PRINCIPAL_INVESTIGATOR,
  CENTRAL_CONTACT,
  LEAD_ORG,
  SITES_ORG_NAME,
  SITES_CONTACT_NAME,
  SITES_CONTACT_PHONE,
  SITES_CONTACT_EMAIL,
  SITES_ORG_EMAIL,
  SITES_ORG_ADDRESS_LINE_1,
  SITES_ORG_ADDRESS_LINE_2,
  SITES_ORG_CITY,
  SITES_ORG_STATE_OR_PROVINCE,
  SITES_ORG_POSTAL_CODE,
  SITES_ORG_CORRDINATES,
  SITES_ORG_RECRUIT_STATUS,
  DISEASES_DISEASE_CODE,
  DISEASES_NCI_THESAURUS_CONCEPT_ID,
  DISEASES_PREFERRED_NAME,
  ELIGIBILITY
];
/*export const INCLUDE_ARR = [
    "nct_id",
    "associated_studies",
    "start_date",
    "completion_date",
    "brief_title",
    "brief_summary",
    "phase",
    "principal_investigator",
    "central_contact",
    "lead_org",
    "sites.org_name",
    "sites.contact_name",
    "sites.contact_phone",
    "sites.org_email",
    "sites.org_address_line_1",
    "sites.org_address_line_2",
    "sites.org_city",
    "sites.org_state_or_province",
    "sites.org_postal_code",
    "sites.org_coordinates",
    "diseases.disease_code",
    "diseases.nci_thesaurus_concept_id",
    "diseases.preferred_name",
    "eligibility"
  ] */

/*export default {
  SIZE_STR: 'size',
  CURRENT_TRIAL_STATUS_STR: 'current_trial_status',
  PURPOSE_CODE_STR: 'primary_purpose.primary_purpose_code',
  POSTAL_CODE_STR: 'sites.org_postal_code',
  DISTANCE_STR: 'sites.org_coordinates_dist',
  KEYWORD_STR: '_fulltext',
  INCLUDE_STR: 'include',
  INCLUDE_ARR: [
    "nct_id",
    "associated_studies",
    "start_date",
    "completion_date",
    "brief_title",
    "brief_summary",
    "phase",
    "principal_investigator",
    "central_contact",
    "lead_org",
    "sites.org_name",
    "sites.contact_name",
    "sites.contact_phone",
    "sites.org_email",
    "sites.org_address_line_1",
    "sites.org_address_line_2",
    "sites.org_city",
    "sites.org_state_or_province",
    "sites.org_postal_code",
    "sites.org_coordinates",
    "diseases.disease_code",
    "diseases.nci_thesaurus_concept_id",
    "diseases.preferred_name",
    "eligibility"
  ]
}; */
