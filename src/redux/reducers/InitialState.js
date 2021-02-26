export const initialState = {
    plan_details:[],
    payment:[],
    is_member:false,
    accountHolder:{},
    basicInfo: {},
    resumeBuilder: {selectedResume:'resume-template1'},
    profileCompletionPercentage:0,
    salary_mean:{},
    my_salary:0,
    profile:{
        personal_details:{
            aboutMe:'',
            countryList:[],
            authType:[],
            sponsor:[],
            authExp:[]
        },
        address_details:{
            countryO:[],
            stateO:[],
            cityO:[],
            addressO:[],
            zipcodeO:[]
        },
        education:{
            institute:[],
            degree:[],
            special:[],
            startM:[],
            endM:[],
            startY:[],
            endY:[],
            activities:[],
            societies:[],
            accomplishments:''
        },
        certifications:{
            name:[],
            endM:[],
            endY:[],
            copy:[]
        },
        work_experience:{
            total_experience:0,
            orgNames:[],
            designations:[],
            jobTitles:[],
            skillsP:[],
            skillsO:[],
            industry:[],
            role:[],
            rnrs:[],
            startM:[],
            endM:[],
            startY:[],
            endY:[],
            tillDate:[],
            empType:[]
        },
        board_experience:{
            boardName:[],
            boardType:[],
            boardEndY:[],
            boardStartY:[],
            boardEndM:[],
            boardStartM:[],
            stillMember:[]
        },
        media:{
            headshot:'https://muit-media.s3.amazonaws.com/default-media/no_preview.jpeg',
            videoshot:null
        },
        social_links:{
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            pinterest: '',
            github: ''
        }
    }
}