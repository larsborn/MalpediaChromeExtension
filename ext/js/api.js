let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};


class MalpediaApi {
    constructor() {
        this.baseUrl = 'https://malpedia.caad.fkie.fraunhofer.de/';
    }

    quickReferenceUrl(query) {
        return this.baseUrl + '?quicksearch=' + query;
    }

    getReferences() {
        return request({url: this.baseUrl + 'api/get/references'}).then(response => {
            if ( !response.hasOwnProperty('references')) return null;
            const references = response.references;
            return Object.keys(references).map(referenceUrl => {
                const a = document.createElement('a');
                a.href = referenceUrl.url;
                return references[referenceUrl].map(reference => {
                    return {
                        referenceUrl: referenceUrl,
                        referenceHostname: a.hostname,
                        referencePathname: a.pathname,
                        malpediaUrl: reference.url,
                        commonName: reference.common_name,
                        id: reference.id,
                        type: reference.type,
                        altNames: reference.alt_names,
                    }
                });
            }).flat();
        })
    }
}