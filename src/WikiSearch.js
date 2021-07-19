import React from 'react';
import { Table } from "antd"

const columns = [
    {
        title: "Page ID",
        dataIndex: "queryResultPageID",
        key: "queryResultPageID",
        sorter: (a, b) => a.queryResultPageID - b.queryResultPageID,
    },
    {
        title: "Title",
        dataIndex: "queryResultPageTitle",
        link: "queryResultPageFullUrl",
        key: "queryResultPageTitle",
        render: text => {

            //let link = link.queryResultPageFullUrl;

            return (<a href={`https://en.wikipedia.org/wiki/${text}`}>{text}</a>);

        },

    },
    {
        title: "Snippet",
        dataIndex: "queryResultPageSnippet",
        key: "queryResultPageSnippet",
        render: text => {
            //let text1 = <p className="description" dangerouslySetInnerHTML={{ __html: text }}></p>
            // <Typography.Text copyable>{text}</Typography.Text>
            return (<p className="description" dangerouslySetInnerHTML={{ __html: text }}></p>);
        }
        //render: text => <Typography.Text copyable>{text}</Typography.Text>


    },
    {
        title: "Timestamp (yyyy/mm/dd time UTC)",
        dataIndex: "queryResultPageTimestamp",
        key: "queryResultPageTimestamp",
        render: text => {
            text = text.substring(0, text.length - 1)
            text = text.replace(/T/g, ' ');
            return (text);
        },
        //sorter: (a, b) => a.text - b.text,
    }
]

class WikiSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wikiSearchReturnValues: [],
            WikiSearchTerms: '',
            currentPage: 1,
            todosPerPage: 10,
            CountOfResults: 20
        }
    }

    useWikiSearchEngine = (e) => {

        if (this.state.WikiSearchTerms === '') {
            alert("Чел ты 💀")
            return false;
        }

        if (this.state.CountOfResults === '' || typeof this.state.CountOfResults !== "number") {
            alert("Чел ты 👊")
            return false;
        }

        e.preventDefault();

        this.setState({
            wikiSearchReturnValues: []
        });

        const pointerToThis = this;
        //console.log(this);

        var url = "https://en.wikipedia.org/w/api.php";

        var params = {
            action: 'query',
            list: 'search',
            srsearch: this.state.WikiSearchTerms,
            format: 'json',
            srlimit: this.state.CountOfResults
        };

        url = url + '?origin=*';
        Object.keys(params).forEach((key) => {
            url += "&" + key + "=" + params[key];
        });


        fetch(url)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (response) {
                    //console.log(response.query.search[0].pageid);
                    for (var key in response.query.search) {
                        pointerToThis.state.wikiSearchReturnValues.push({
                            queryResultPageFullUrl: 'no link',
                            queryResultPageID: response.query.search[key].pageid,
                            queryResultPageTitle: response.query.search[key].title,
                            queryResultPageSnippet: response.query.search[key].snippet,
                            queryResultPageTimestamp: response.query.search[key].timestamp
                        }
                        )
                    }
                }
            )
            .then(
                function (response) {
                    for (var key2 in pointerToThis.state.wikiSearchReturnValues) {
                        //console.log(pointerToThis.state.wikiSearchReturnValues)

                        let page = pointerToThis.state.wikiSearchReturnValues[key2];
                        let pageID = page.queryResultPageID;
                        let urlForRetrievingPageUrlByPageID = `https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=${pageID}&inprop=url&format=json`;

                        fetch(urlForRetrievingPageUrlByPageID)
                            .then(
                                function (response) {
                                    return response.json();
                                }
                            )
                            .then(
                                function (response) {
                                    //console.log(response, "response");
                                    page.queryResultPageFullUrl = response.query.pages[pageID].fullurl;
                                    //console.log(page.queryResultPageFullUrl, "full url")

                                    pointerToThis.forceUpdate();
                                }
                            )
                    }

                }
            )
    }

    changeWikiSearchTerms = (e) => {

        this.setState({
            WikiSearchTerms: e.target.value
        })
    }

    changecountSearchTerms = (e) => {

        this.setState({
            CountOfResults: e.target.value
        })

    }


    render() {
        let wikiSearchResults = [];

        if (this.state.wikiSearchReturnValues.length !== 0) {
            console.log(this.state.wikiSearchReturnValues, "last array")
            wikiSearchResults.push(
                <div className="searchResultDiv">
                    <Table
                        dataSource={this.state.wikiSearchReturnValues}
                        columns={columns}
                        pagination={
                            {
                                showSizeChanger: true,
                                pageSizeOptions: [5, 10, 15, 20]
                            }
                        } />
                </div>

            )
        }
        //console.log(this.state.wikiSearchReturnValues, "Резы")

        return (
            <div className="App">
                <h1>Search from wikipedia</h1>
                <form action="">
                    <input type="text" value={this.state.WikiSearchTerms} onChange={this.changeWikiSearchTerms} placeholder='Search something' />
                    <input type="text" value={this.state.CountOfResults} onChange={this.changecountSearchTerms} placeholder='Count of pages' />
                    <button type='submit' onClick={this.useWikiSearchEngine}>Search</button>
                </form>


                {wikiSearchResults}
            </div>

        );
    }
}



export default WikiSearch;
