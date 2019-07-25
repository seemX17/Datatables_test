
var BranchEngine = {

    settings: {
        url: "https://vast-shore-74260.herokuapp.com/banks?city=",
        selectBox: document.getElementById('city-select-box'),
        inputBox: document.getElementById('branch-search'),
        tableBody: document.getElementById('branchTableBody'),
        loader: $('.loader-cover'),
        table: $('#branchTable'),
        cityName: "",
        data: null
    }, 

    init: function () {
        s = this.settings;
        this.bindEvents();

        //Fire selection for default selected option
        this.onDropdownSelection();
    },

    bindEvents: function () {
        s.selectBox.addEventListener("change", this.onDropdownSelection.bind(this));
        s.inputBox.addEventListener("keyup", this.filterData.bind(this));
    },

    onDropdownSelection: function () {
        let city_name = s.selectBox.options[s.selectBox.selectedIndex].value;
        s.cityName = city_name.toUpperCase();
        let final_url = s.url + s.cityName;
        s.data = this.fetchData(final_url);

        //render
        this.renderData();
    },

    fetchData: function (url) {
        s.loader.show();
        return fetch(url)
            .then((response) => {
                return response.json().then((data) => {
                    s.loader.hide();
                    return data;
                }).catch((err) => {
                    console.log(err);
                });
            });
    },

    renderData: function () {
        s.data.then((results) => {
            var branches = results;
            let html = "";
            for (var i = 0; i < results.length; i++) {
                html += "<tr>" +
                    "<td>" + branches[i].ifsc + "</td>" +
                    "<td>" + branches[i].branch + "</td>" +
                    "<td>" + branches[i].city + "</td>" +
                    "<td>" + branches[i].district + "</td>" +
                    "<td>" + branches[i].state + "</td>" +
                    "<td>" + branches[i].bank_name + "</td>" +
                    "</tr>";
            }
            s.tableBody.innerHTML = html;
            this.paginateData();
        });
    },

    paginateData: function () {
        s.table.DataTable({
            "pagingType": "full_numbers",
            "bFilter": false
        });
    },

    filterData: function () {
        let value = s.inputBox.value.toLowerCase();
        $("#branchTableBody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    }
};

//Get Started
BranchEngine.init();