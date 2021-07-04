import React from 'react';
import styled from 'styled-components'
import ReactPaginate from 'react-paginate';


const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

class WikiSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wikiSearchReturnValues: [],
            WikiSearchTerms: '',
            currentPage: 1,
            todosPerPage: 10
        }
        this.handleClick = this.handleClick.bind(this);
    }

    useWikiSearchEngine = (e) => {
        e.preventDefault();

        this.setState({
            wikiSearchReturnValues: []
        });

        const pointerToThis = this;
        console.log(this);

        var url = "https://en.wikipedia.org/w/api.php";

        var params = {
            action: 'query',
            list: 'search',
            srsearch: this.state.WikiSearchTerms,
            format: 'json',
            srlimit: 20
        };

        url = url + '?origin=*';
        Object.keys(params).forEach((key) => {
            url += "&" + key + "=" + params[key];
        });
        console.log(url, "start")

        fetch(url)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                function (response) {
                    console.log(response);
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

    handleClick(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    render() {
        let wikiSearchResults = [];

        const { wikiSearchReturnValues, currentPage, todosPerPage } = this.state;

        // Logic for displaying todos
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = wikiSearchReturnValues.slice(indexOfFirstTodo, indexOfLastTodo);
        //console.log(currentTodos, "currTodo")

        // Logic for displaying page numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(wikiSearchReturnValues.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers.map(number => {
            return (

                <li
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });


        if (this.state.wikiSearchReturnValues.length !== 0) {
            wikiSearchResults.push(
                <div className="searchResultDiv">
                    <Styles>
                        <table border="2">
                            <thead>
                                <th>Page ID</th>
                                <th>Title</th>
                                <th>Snippet</th>
                                <th>Timestamp</th>

                            </thead>
                            <tbody>
                                {
                                    currentTodos.map((tdata, i) => (
                                        <tr>
                                            <td>{tdata.queryResultPageID}</td>
                                            <td>{<h3><a href={tdata.queryResultPageFullUrl}>{tdata.queryResultPageTitle}</a></h3>}</td>
                                            <td>{<p className="description" dangerouslySetInnerHTML={{ __html: tdata.queryResultPageSnippet }}></p>}</td>
                                            <td>{tdata.queryResultPageTimestamp}</td>

                                        </tr>

                                    ))
                                }

                            </tbody>
                        </table>
                    </Styles>
                </div>

            )
        }
        console.log(this.state.wikiSearchReturnValues, "Резы")

        // if (this.state.WikiSearchTerms === '') {

        //     alert("Чел, ты введи что-то")

        // }

        return (
            <div className="App">
                <h1>Search from wikipedia</h1>
                <form action="">
                    <input type="text" value={this.state.WikiSearchTerms} onChange={this.changeWikiSearchTerms} placeholder='Search something' />
                    <button type='submit' onClick={this.useWikiSearchEngine}>Search</button>
                </form>

                {wikiSearchResults}
                <ul>
                    {renderPageNumbers}
                </ul>
            </div>

        );
    }
}



export default WikiSearch;
