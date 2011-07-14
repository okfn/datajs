/*
Write tabular data as HTML table.

	:tabular: tabular data object (dict with header and data keys).
	:options: optional keyword arguments:
		colTypes: types of columns keyed by column name
		displayNames: ditto for display names for columns
*/
writeTabularAsHtml = function(tabular) {
	var options = {};
	if (arguments.length > 1) {
		options = arguments[1];
	}
	var colTypes = {};
	var displayNames = {};
	if (options.colTypes) {
		colTypes = options.colTypes;
	}
	if (options.displayNames) {
		displayNames = options.displayNames;
	}
	// knows how to format and justify based on combination of col type labelling (via colTypes)
	// and value based logic
	var _ColType=[];
	var _thead = $('<thead></thead>');
	$.each(tabular.header, function(i,col) {
		var tempDisplayName = displayNames[col] ? displayNames[col] : col;
		_thead.append($('<th></th>').append(tempDisplayName));
		if (colTypes[col]) {
			_ColType[i]=colTypes[col];
		}
	});
	var _tbody = $('<tbody></tbody>');
	// var red = /^(19|20)\d{2}$/; - replaced by _ColType
	// var rep = /^([\d\.\-]+)\%$/; - replaced by _ColType
	var ren = /^[\d\.\-]+$/;
	var reb = /^$/;
	$.each(tabular.data, function(i,row) {
    var _newrow = $('<tr></tr>');
    $.each(row, function(j, cell) {
      // decide action depending on type
      var cell2;
      if(_ColType[j] == 'range'){
        // year range
        var cell3 = parseFloat(cell);
        cell3++;
        cell2=cell+'-'+cell3;
            _newrow.append($('<td></td>').append(cell2));
      } else if(reb.test(cell)){
        // blank
        cell2='';
        _newrow.append($('<td></td>').append(cell2));
      } else if(_ColType[j] == 'percent'){
        // percent
        // 20.5% saved as 0.205. Converted back here to 20.5%
        var cell3=cell*100;
        cell2=cell3.toFixed(1)+'%';
        _newrow.append($('<td class="amount"></td>').append(cell2));
      } else if(ren.test(cell)){
        // number
        var cell3=parseFloat(cell);
        cell2=cell3.toFixed(0);
        _newrow.append($('<td class="amount"></td>').append(cell2));
      } else{
        // other
        cell2=cell;
        _newrow.append($('<td></td>').append(cell2));
      }
    });
	_tbody.append(_newrow);
	});
	return {'thead': _thead, 'tbody': _tbody};
}

