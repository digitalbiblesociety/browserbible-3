/**
 * Loads text information and content from a series of providers
 */
class TextLoader {
    constructor() {
        
        this.providers = {};
    
        this.allProviderTextsLoaded = false;
        this.textInfoList = [];
        this.textInfoCallbacks = [];
    }
    
    /**
     * Loads a single chapter ('section') of text from a provider
     * @param {string} fulltextid in the form of provider:textid
     * @param {string} sectionid usfm code for chapter (GEN_1)
     * @param {function} successCallback returns chapter data
     * @param {function} errorCallback for missing data
     */
    loadSection(fulltextid, sectionid, successCallback, errorCallback) {
        let parts = fulltextid.split(':'),
            providerName = parts[0],
            textid = parts[1],
            providerInfo = this.providers[providerName],
            load = () => {
                providerInfo.provider.loadSection(textid, sectionid, successCallback, errorCallback);
            };

        if (providerInfo.isLoaded) {
            load();
        } else {
            providerInfo.callbacks.push(load);
        }
    }


    /**
     * Callback that returns a list of texts
     *
     * @callback successCallback
     * @param {Array} textInfoList all available texts
     */
    /**
     * Returns all possible texts from all providers
     * @param {function} callback sends texts list back
     */
    getTextsList(callback) {
        if (this.allProviderTextsLoaded) {
            callback(this.textInfoList);
        } else {
            this.textInfoCallbacks.push(callback);
        }
    }

    /**
     * Callback that returns a text
     * 
     * @callback successCallback
     * @param {Object} textInfo all the properties of a text
     */    
    /**
     * Loads the information (name, language, chapters) of a text
     * @param {string} fulltextid in the form of provider:textid     
     * @param {function} successCallback returns text data
     * @param {function} errorCallback for missing data
     */
    getTextInfo(fulltextid, successCallback, errorCallback) {
        let parts = fulltextid.split(':'),
            providerName = parts[0],
            textid = parts[1],
            providerInfo = this.providers[providerName],
            load = () => {
                providerInfo.provider.getTextInfo(textid, successCallback, errorCallback);
            };

        if (providerInfo.isLoaded) {
            load();
        } else {
            providerInfo.callbacks.push(load);
        }            
    }

    /**
     * During setup, creates new providers
     * @param {string} providerName key for the provider to connect to texts
     * @param {class} provider an instantiated class that responds to callss
     */
    addProvider(provider) {
        let providerInfo = this.providers[provider.providerName] = {
            isLoaded: false,
            providerName: provider.providerName,
            provider: provider,
            callbacks: []
        };

        // set loading 
        this.allProviderTextsLoaded = false;

        providerInfo.provider.getTextList((providerTextInfoList) => {
            
            providerInfo.isLoaded = true;
            this.processTexts(providerTextInfoList, providerInfo.providerName);
            
            // combine all texts from all providers
            this.textInfoList = this.textInfoList.concat(providerTextInfoList);
            this.checkLoadingStatus();

            while (providerInfo.callbacks.length > 0) {
                // this fires the .load() function above
                let callback = providerInfo.callbacks.pop();
                callback();
            }
        });
    }

    processTexts(textInfoList, providerName) {
        for (let textinfo of textInfoList) {
            textinfo.providerName = providerName;
            textinfo.providerid = providerName + ':' + textinfo.id;

            // hook for countries?
            //this.trigger('processtext', textinfo);
        }
    }    

    checkLoadingStatus() {
        this.allProviderTextsLoaded = Object.values(this.providers).filter((p) => !p.isLoaded) == 0;
        if (this.allProviderTextsLoaded) {
            while (this.textInfoCallbacks.length > 0) {
                let callback = this.textInfoCallbacks.pop();
                callback(this.textInfoList);
            }
        }
    }
}