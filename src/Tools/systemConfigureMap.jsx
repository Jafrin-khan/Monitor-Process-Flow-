const systemConfigureMap = {
    "Dev": {
      endpoint:
        "https://cgt-r1-pocsub1-eu12.authentication.eu12.hana.ondemand.com"
    },
    "QA": {
      endpoint: "https://api.system2.com"
    },
    "GxP": {
      endpoint: "https://api.system3.com"
    }
  };
  export const getDomainName = (system) => {
    if (system in systemConfigureMap) {
      return systemConfigureMap[system]?.endpoint;
    }
    return null;
  };
  