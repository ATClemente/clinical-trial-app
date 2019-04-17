//MainSearchQueryParams.js

//Query Parameters
export const SIZE_STR = "size";
export const CURRENT_TRIAL_STATUS_STR = "current_trial_status";
export const PURPOSE_CODE_STR = "primary_purpose.primary_purpose_code";
export const POSTAL_CODE_STR = "sites.org_postal_code";
export const DISTANCE_STR = "sites.org_coordinates_dist";
export const KEYWORD_STR = "_fulltext";
export const INCLUDE_STR = "include";

//Attributes to return from API:
export const INCLUDE_ARR = [
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
};*/