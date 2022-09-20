
export function createFakeServer(fakeServerData) {
    function FakeServer(allData) {
        this.data = allData;
    }

    FakeServer.prototype.getData = function (request) {
        function extractRowsFromData(groupKeys, data) {
            if (groupKeys.length === 0) {
                return data.map(function (d) {
                    return {
                        group: !!d.childCategories,
                        ...d
                    };
                });
            }

            let key = groupKeys[0];
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === key) {
                    return extractRowsFromData(
                        groupKeys.slice(1),
                        data[i].childCategories.slice()
                    );
                }
            }
        }

        return extractRowsFromData(request.groupKeys, this.data);
    };
    return new FakeServer(fakeServerData);
}


export function ServerSideDataSource(server) {
    return {
        getRows: function (params) {
            let response = server.getData(params.request)
            setTimeout(function () {
                params.success({
                    rowData: response,
                    rowCount: response.length,
                });
            }, 200);
        }
    }
}