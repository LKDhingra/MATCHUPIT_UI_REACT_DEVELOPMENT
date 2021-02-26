export const setAuthToken=(payload)=>{
    return{ 
        type: "SET_AUTH_TOKEN",
        payload
    }
};
export const setBasicInfo=(payload)=>{
    return{ 
        type: "SET_BASIC_INFO",
        payload
    }
};
export const setProfileCompletion=(payload)=>{
    return{ 
        type: "SET_PROFILE_COMPLETION",
        payload
    }
};
export const setCorporateInfo=(payload)=>{
    return{ 
        type: "SET_CORPORATE_INFO",
        payload
    }
};
export const setProfileInfo=(payload)=>{
    return{ 
        type: "SET_PROFILE_INFO",
        payload
    }
};
export const setWorkAuthObj=(payload)=>{
    return{ 
        type: "SET_WORK_AUTH_OBJ",
        payload
    }
};
export const setEducationObj=(payload)=>{
    return{ 
        type: "SET_EDUCATION_OBJ",
        payload
    }
};
export const setCertificationObj=(payload)=>{
    return{ 
        type: "SET_CERTIFICATION_OBJ",
        payload
    }
};
export const setWorkExpObj=(payload)=>{
    return{ 
        type: "SET_WORK_EXP_OBJ",
        payload
    }
};
export const setCorporateVideo=(payload)=>{
    return{ 
        type: "SET_CORPORATE_VIDEO",
        payload
    }
};
export const updateUserName=(first_name, last_name)=>{
    return{ 
        type: "UPDATE_USER_NAME",
        payload: {first_name:first_name, last_name:last_name}
    }
};
export const updatePhoneNo=(payload)=>{
    return{ 
        type: "UPDATE_PHONE_NO",
        payload
    }
};
export const updateDialCode=(payload)=>{
    return{ 
        type: "UPDATE_DIAL_CODE",
        payload
    }
};
export const updateRecoveryEmail=(payload)=>{
    return{ 
        type: "UPDATE_RECOVERY_EMAIL",
        payload
    }
};
export const updateCountryName=(payload)=>{
    return{ 
        type: "UPDATE_COUNTRY_NAME",
        payload
    }
};
export const updateZipcode=(payload)=>{
    return{ 
        type: "UPDATE_ZIPCODE",
        payload
    }
};
export const updateAddressLine=(payload)=>{
    return{ 
        type: "UPDATE_ADDRESS_LINE",
        payload
    }
};
export const updateStateName=(payload)=>{
    return{ 
        type: "UPDATE_STATE_NAME",
        payload
    }
};
export const updateCityName=(payload)=>{
    return{ 
        type: "UPDATE_CITY_NAME",
        payload
    }
};
export const updateCitizenship=(payload)=>{
    return{ 
        type: "UPDATE_CITIZENSHIP",
        payload
    }
};
export const updateDateOfBirth=(payload)=>{
    return{ 
        type: "UPDATE_DATE_OF_BIRTH",
        payload
    }
};
export const updateProfilePic=(payload)=>{
    return{ 
        type: "UPDATE_PROFILE_PIC",
        payload
    }
};
export const updateAuthorizedCountry=(payload)=>{
    return{ 
        type: "UPDATE_AUTHORIZED_COUNTRY",
        payload
    }
};
export const showFlatForm=(payload)=>{
    return{ 
        type: "SHOW_FLAT_FORM",
        payload
    }
};
export const setSocialLinks=(payload)=>{
    return{ 
        type: "SET_SOCIAL_LINKS",
        payload
    }
};
export const setPaymentStatus=(payload)=>{
    return{ 
        type: "SET_PAYMENT_STATUS",
        payload
    }
};
export const setPaymentInfo=(payload)=>{
    return{ 
        type: "SET_PAYMENT_INFO",
        payload
    }
};
export const addPaymentInfo=(payload)=>{
    return{ 
        type: "ADD_PAYMENT_INFO",
        payload
    }
};
export const setOtherAddresses=(payload)=>{
    return{ 
        type: "SET_OTHER_ADDRESSES",
        payload
    }
};
export const viewResumeList=(payload)=>{
    return{ 
        type: "VIEW_RESUME_LIST",
        payload
    }
};
export const updateCurrentResume=(payload)=>{
    return{ 
        type: "UPDATE_CURRENT_RESUME",
        payload
    }
};
export const buildResumeStatus=(payload)=>{
    return{ 
        type: "BUILD_RESUME_STATUS",
        payload
    }
};
export const showUserResume=(payload)=>{
    return{ 
        type: "SHOW_USER_RESUME",
        payload
    }
};
export const addWorkAuthRow=(payload)=>{
    return{ 
        type: "ADD_WORK_AUTH_ROW",
        payload
    }
};
export const addAddressRow=(payload)=>{
    return{ 
        type: "ADD_ADDRESS_ROW",
        payload
    }
};
export const newWorkAuth=(payload)=>{
    return{ 
        type: "NEW_WORK_AUTH",
        payload
    }
};
export const deleteWorkAuthRow=(payload)=>{
    return{ 
        type: "DELETE_WORK_AUTH_ROW",
        payload
    }
};
export const deleteAddressRow=(payload)=>{
    return{ 
        type: "DELETE_ADDRESS_ROW",
        payload
    }
};
export const addEducationRow=(payload)=>{
    return{ 
        type: "ADD_EDUCATION_ROW",
        payload
    }
};
export const deleteEducationRow=(payload)=>{
    return{ 
        type: "DELETE_EDUCATION_ROW",
        payload
    }
};
export const addCertificationRow=(payload)=>{
    return{ 
        type: "ADD_CERTIFICATION_ROW",
        payload
    }
};
export const deleteCertificationRow=(payload)=>{
    return{ 
        type: "DELETE_CERTIFICATION_ROW",
        payload
    }
};
export const addWorkExpRow=(payload)=>{
    return{ 
        type: "ADD_WORK_EXP_ROW",
        payload
    }
};
export const deleteWorkExpRow=(payload)=>{
    return{ 
        type: "DELETE_WORK_EXP_ROW",
        payload
    }
};
export const updateHeadshot=(payload)=>{
    return{ 
        type: "UPDATE_HEADSHOT",
        payload
    }
};
export const setSalaryMean=(payload)=>{
    return{ 
        type: "SET_SALARY_MEAN",
        payload
    }
};
export const updateLiveVideo=(payload)=>{
    return{ 
        type: "UPDATE_LIVE_VIDEO",
        payload
    }
};
export const setAvailableHire=(payload)=>{
    return{ 
        type: "SET_AVAILABLE_HIRE",
        payload
    }
};
export const setCurrentlyHiring=(payload)=>{
    return{ 
        type: "SET_CURRENTLY_HIRING",
        payload
    }
};
export const setAccountHolder=(payload)=>{
    return{ 
        type: "SET_ACCOUNT_HOLDER",
        payload
    }
};
export const updateMembers=(payload)=>{
    return{ 
        type: "UPDATE_MEMBERS",
        payload
    }
};
export const setIsMember=(payload)=>{
    return{ 
        type: "SET_IS_MEMBER",
        payload
    }
};
export const setPlanDetails=(payload)=>{
    return{ 
        type: "SET_PLAN_DETAILS",
        payload
    }
};
export const setAboutMe=(payload)=>{
    return{ 
        type: "SET_ABOUT_ME",
        payload
    }
};
export const setIsStudent=(payload)=>{
    return{ 
        type: "SET_IS_STUDENT",
        payload
    }
};
export const addBoardExpRow=(payload)=>{
    return{ 
        type: "ADD_BOARD_EXPERIENCE_ROW",
        payload
    }
};
export const deleteBoardExpRow=(payload)=>{
    return{ 
        type: "DELETE_BOARD_EXPERIENCE_ROW",
        payload
    }
};
export const setBoardExpObj=(payload)=>{
    return{ 
        type: "SET_BOARD_EXPERIENCE_OBJ",
        payload
    }
};