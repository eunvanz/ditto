import {
  ModelFieldDoc,
  ModelDoc,
  FIELD_TYPE,
  EnumerationDoc,
  RequestDoc,
  REQUEST_METHOD,
  GroupDoc,
  ResponseStatusDoc,
} from "../types";

const project = {
  id: "imIYYtrWFJjpU9aeTRlQ",
  members: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: true,
  },
  settingsByMember: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
      seq: 1,
      updatedAt: {
        seconds: 1601177065,
        nanoseconds: 409000000,
      },
    },
  },
  title: "첫번째 새 프로젝트",
  updatedAt: {
    seconds: 1601177065,
    nanoseconds: 409000000,
  },
  guests: {},
  owners: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: true,
  },
  createdAt: {
    seconds: 1601176525,
    nanoseconds: 902000000,
  },
  managers: {},
  createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  description: "새 플젝",
};

const projectUrls = [
  {
    id: "OK2qkDQWkXlAV1Ci05mt",
    label: "베이스URL",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    description: "손켓몬 베이스 URL",
    projectId: "imIYYtrWFJjpU9aeTRlQ",
    createdAt: {
      seconds: 1601466152,
      nanoseconds: 638000000,
    },
    updatedAt: {
      seconds: 1601466152,
      nanoseconds: 638000000,
    },
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    url: "https://handpokemon.com",
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466152,
          nanoseconds: 638000000,
        },
      },
    },
  },
  {
    id: "qeQerLSo67IbwPPNwKRM",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    label: "베이스URL2",
    description: "코딧 베이스 URL",
    url: "https://codit.to",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    projectId: "imIYYtrWFJjpU9aeTRlQ",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466174,
          nanoseconds: 963000000,
        },
      },
    },
  },
  {
    id: "DNTfCeDynQsMN0Ly7R5Z",
    createdAt: {
      seconds: 1601466203,
      nanoseconds: 243000000,
    },
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    label: "테스트URL",
    description: "카카오 베이스 URL",
    url: "https://kakao.com",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466203,
          nanoseconds: 243000000,
        },
      },
    },
    updatedAt: {
      seconds: 1601466203,
      nanoseconds: 243000000,
    },
    projectId: "imIYYtrWFJjpU9aeTRlQ",
  },
];

const modelFields: ModelFieldDoc[] = [
  {
    id: "mockId",
    projectId: "mockProjectId",
    modelId: "mockModelId",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466203,
          nanoseconds: 243000000,
        },
      },
    },
    fieldName: {
      id: "mockId",
      value: "mockField",
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: "mockField",
        },
      },
    },
    isRequired: {
      id: "mockId",
      value: true,
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: true,
        },
      },
    },
    isArray: {
      id: "mockId",
      value: false,
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: false,
        },
      },
    },
    fieldType: {
      id: "mockId",
      value: FIELD_TYPE.STRING,
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: FIELD_TYPE.STRING,
        },
      },
    },
    format: {
      id: "mockId",
      value: "없음",
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: "없음",
        },
      },
    },
    enum: {
      id: "mockId",
      value: "없음",
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: "없음",
        },
      },
    },
    description: {
      id: "mockId",
      value: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
      updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      createdAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
      settingsByMember: {
        aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
          updatedAt: {
            seconds: 1601466174,
            nanoseconds: 963000000,
          },
          value: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
        },
      },
    },
  },
];

const model: ModelDoc = {
  id: "mockId",
  projectId: "mockProjectId",
  name: "mockModel",
  updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  updatedAt: {
    seconds: 1601466174,
    nanoseconds: 963000000,
  },
  createdAt: {
    seconds: 1601466174,
    nanoseconds: 963000000,
  },
  settingsByMember: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
    },
  },
};

const models: ModelDoc[] = [
  {
    id: "mockId",
    projectId: "mockProjectId",
    name: "mockModel",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466174,
          nanoseconds: 963000000,
        },
      },
    },
  },
  {
    id: "mockId2",
    projectId: "mockProjectId2",
    name: "mockModelSub",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466174,
          nanoseconds: 963000000,
        },
      },
    },
  },
];

const enumerations: EnumerationDoc[] = [
  {
    id: "mockId",
    projectId: "mockProjectId",
    name: "Status",
    fieldType: FIELD_TYPE.STRING,
    items: ["WAITING", "SUBMITIING", "LOADING"],
    description: "상태",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466174,
          nanoseconds: 963000000,
        },
      },
    },
  },
  {
    id: "mockId2",
    projectId: "mockProjectId",
    name: "Gender",
    fieldType: FIELD_TYPE.STRING,
    items: ["FEMALE", "MALE", "QUEER"],
    description: "성별",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    updatedAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    createdAt: {
      seconds: 1601466174,
      nanoseconds: 963000000,
    },
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1601466174,
          nanoseconds: 963000000,
        },
      },
    },
  },
];

const request: RequestDoc = {
  id: "mockId",
  projectId: "mockId",
  name: "펫 정보 가져오기",
  summary: "아이디로 펫 정보 조회",
  path: "pet/{petId}",
  baseUrl: projectUrls[0].id,
  method: REQUEST_METHOD.GET,
  isDeprecated: false,
  updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  updatedAt: {
    seconds: 1601466174,
    nanoseconds: 963000000,
  },
  createdAt: {
    seconds: 1601466174,
    nanoseconds: 963000000,
  },
  settingsByMember: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
      updatedAt: {
        seconds: 1601466174,
        nanoseconds: 963000000,
      },
    },
  },
};

const groups: GroupDoc[] = [
  {
    id: "uiHgP7mMOb8sC0r68kZo",
    name: "Kakaotalk",
    updatedAt: {
      seconds: 1612988925,
      nanoseconds: 834000000,
    },
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    createdAt: {
      seconds: 1612984347,
      nanoseconds: 464000000,
    },
    projectId: "imIYYtrWFJjpU9aeTRlQ",
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1612988925,
          nanoseconds: 834000000,
        },
      },
    },
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  },
  {
    id: "S6BzFlmKVGDSW57XUfv5",
    name: "Toss",
    projectId: "imIYYtrWFJjpU9aeTRlQ",
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1612984508,
          nanoseconds: 990000000,
        },
      },
    },
    createdAt: {
      seconds: 1612984508,
      nanoseconds: 990000000,
    },
    updatedAt: {
      seconds: 1612984508,
      nanoseconds: 990000000,
    },
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  },
  {
    id: "0NCnRDCZ6obqSUpv0iMa",
    name: "Naver",
    createdAt: {
      seconds: 1614528706,
      nanoseconds: 639000000,
    },
    createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    projectId: "imIYYtrWFJjpU9aeTRlQ",
    updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
    settingsByMember: {
      aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
        updatedAt: {
          seconds: 1614528706,
          nanoseconds: 639000000,
        },
      },
    },
    updatedAt: {
      seconds: 1614528706,
      nanoseconds: 639000000,
    },
  },
];

const responseStatus: ResponseStatusDoc = {
  id: "mockId",
  projectId: "mockId",
  requestId: "mockId",
  statusCode: 200,
  settingsByMember: {
    aYMTrCiTE7avCY1yeNHVt9XHX4N2: {
      updatedAt: {
        seconds: 1614528706,
        nanoseconds: 639000000,
      },
    },
  },
  updatedAt: {
    seconds: 1614528706,
    nanoseconds: 639000000,
  },
  createdAt: {
    seconds: 1614528706,
    nanoseconds: 639000000,
  },
  createdBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
  updatedBy: "aYMTrCiTE7avCY1yeNHVt9XHX4N2",
};

const mockProject = {
  project,
  projectUrls,
  modelFields,
  model,
  models,
  enumerations,
  request,
  groups,
  responseStatus,
};

export default mockProject;
