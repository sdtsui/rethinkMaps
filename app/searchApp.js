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

        return (
            <table>
                <tbody className='locationRowHolder'>{rows}</tbody>
            </table>
        );
    }
});

var LocationRow = React.createClass({
    handleClick: function() {
      console.log(this.props);
    },
    render: function() {
        var placeName = this.props.product.placeName;
        return (
            <tr>
                <td className='locationRow' onClick={this.handleClick}>{placeName}</td>
            </tr>
        );
    }
});
