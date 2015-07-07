/** @jsx React.DOM */


/**
 * Global Handler Functions
 */

// var printAllProps = function() {

// }


/**
 * Components
 */

var LocationRow = React.createClass({
    handleClick: function() {
      console.log(this.props);
    },
    render: function() {
        var placeName = this.props.product.placeName;
        return (
            <tr>
                <td onClick={this.handleClick}>{placeName}</td>
            </tr>
        );
    }
});

var LocationsTable = React.createClass({
    render: function() {
        console.log(this.props);
        var rows = [];
        var lastCategory = null;
        this.props.locations.forEach(function(product) {
            if (product.placeName.indexOf(this.props.filterText) === -1) {
                return;
            }
            rows.push(<LocationRow product={product} key={product.placeName} />);
        }.bind(this));

        //Warn: component could use a bunch of styling
        return (
            <table>
                <tbody>{rows}</tbody>
            </table>
        );
    }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.getDOMNode().value
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search for places!"
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
      </form>
    );
  }
});

var FilterableLocationsTable = React.createClass({
  getInitialState: function() {
    return {
      filterText: ''
    };
  },

  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },

  render: function() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
        />
        <LocationsTable
          locations={this.props.locations}
          filterText={this.state.filterText}
        />
      </div>
    );
  }
});

//Make POST here, render after locations returned
var locations = [
  {
    placeName: "2001 Hillside Blvd, Colma, CA 94014",
    location : [37.680573, -122.446698]
  },
  {
    placeName: "300 Finley Road, San Francisco, CA 94129",
    location : [37.788773, -122.460603]
  },
  {
    placeName: "99 Harding Rd, San Francisco, CA 94132",
    location : [37.724035, -122.492532]
  },
  {
    placeName: "100 John F Shelley Dr, San Francisco, CA 94134",
    location : [37.719146, -122.421121]
  },
  {
    placeName: "2300 Junipero Serra Blvd, Daly City, CA 94015",
    location : [37.697689, -122.477425]
  }
];

if (!__DEV_SEARCHOFF) {
  React.render(<FilterableLocationsTable locations={locations} />, 
    document.getElementById('searchContainer'));
}