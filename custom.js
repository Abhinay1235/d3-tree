
var chart;
sessionStorage.setItem('currentEvent', null);
sessionStorage.setItem('currentNode', null);
sessionStorage.setItem('d3Data', JSON.stringify([
    {"id":"1678693936114","name":"Arnold","parentId":"","message":"Chief Executive Officer","number":"000-000-0000","type":"manager"},
    {"id":"1678693948811","name":"Brad Pit","parentId":"1678693936114","message":"Chief Technology Officer","number":"000-000-0000","type":"employee"},
    {"id":"1678693958011","name":"Pete","parentId":"1678693936114","message":"Chief Technology Officer","number":"000-000-0000","type":"employee"},
    {"id":"1678693998790","name":"Chris","parentId":"1678693958011","message":"Chief Technology Officer","number":"000-000-0000","type":"employee"},
    {"id":"1678694174624","name":"Tom","parentId":"1678693936114","message":"Chief Technology Officer","number":"000-000-0000","type":"employee"},
    {"id":"1678694186537","name":"Tom","parentId":"1678693958011","message":"Chief Technology Officer","number":"000-000-0000","type":"employee"}
]));

function addNode() {
    const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
    const e_node = {
        id: `${Date.now()}`,
        parentId: currentNode.id,
        name:  $('#d3-add-node-name').val(),
        message: $('#d3-add-node-message').val(),
        number: $('#d3-add-node-number').val(),
        type: $('#d3-add-node-type').val(),
    }
    chart.addNode({...e_node,_centered:true});
    $('#addNodeModal').modal('hide');
    sessionStorage.setItem('currentEvent', null);
}

function openAddModal() {
    sessionStorage.setItem('currentEvent', 'addNode');
    setTimeout(() => {
        const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
        document.getElementById("addNodeModalLabel").innerHTML = `Add New Child to ${currentNode.name}`;
        $('#d3-edit-current-node').removeClass("show");
        $('#addNodeModal').modal({keyboard: false, backdrop: 'static'});
        $('#addNodeModal').modal('show');
    }, 50);
}

function openDeleteModal() {
    sessionStorage.setItem('currentEvent', 'deleteNode');
    setTimeout(() => {
        const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
        document.getElementById("deleteNodeModalLabel").innerHTML = `Delete ${currentNode.name}`;
        $('#d3-edit-current-node').removeClass("show");
        $('#deleteNodeModal').modal({keyboard: false, backdrop: 'static'});
        $('#deleteNodeModal').modal('show');
    }, 50);
}

function deleteNode() {
    const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
    chart.removeNode(currentNode.id);
    $('#deleteNodeModal').modal('hide');
    sessionStorage.setItem('currentEvent', null);
}

function closeModal() {
    $('#addNodeModal').modal('hide');
    $('#deleteNodeModal').modal('hide');
    sessionStorage.setItem('currentEvent', null);
}

function onNodeClick(d) {
    sessionStorage.setItem('currentNode', JSON.stringify(d));
    setTimeout(() => {
        editCurrentNode(d);
    }, 50);
}

function editCurrentNode(d) {
    const currentEvent = sessionStorage.getItem('currentEvent');
    if((currentEvent !== 'addNode') && (currentEvent !== 'deleteNode')) {
        const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
        $('#d3-current-node-name-edit').val(currentNode.name);
        $('#d3-current-node-message-edit').val(currentNode.message);
        $('#d3-current-node-number-edit').val(currentNode.number);
        $('#d3-current-node-type-edit').val(currentNode.type);
        $('#d3-edit-current-node').addClass("show");
    }
}

function saveCurrentNode() {
    const currentNode = JSON.parse(sessionStorage.getItem('currentNode'));
    const e_node = {
        id: currentNode.id,
        parentId: currentNode.parentId,
        name:  $('#d3-current-node-name-edit').val(),
        message: $('#d3-current-node-message-edit').val(),
        number: $('#d3-current-node-number-edit').val(),
        type: $('#d3-current-node-type-edit').val(),
    }
    chart.updateNode(e_node);
    $('#d3-edit-current-node').removeClass("show");
}

function closeCurrentEditNode() {
    $('#d3-edit-current-node').removeClass("show");
}

function loadData() {
    const data = JSON.parse(sessionStorage.getItem('d3Data'));
    buildVisualization(data);
}

function saveData() {
    console.log(chart.getChartState().data.map(e => {return {id:e.id,name:e.name,parentId:e.parentId,message:e.message,number:e.number,type:e.type}}))
}

function buildVisualization(d3Data) {
    chart = new d3.OrgChart()
            .container('.chart-container')
            .data(d3Data)
            .scaleExtent([1,1])
            .nodeHeight(d => 85)
            .nodeWidth(d => {
                return 220
            })
            .onNodeClick(d => onNodeClick(d))
            .buttonContent(({ node, state }) => {
                return `<div class="d3-count-button"> <span>${node.children ? `<i class="fas fa-angle-up"></i>` : `<i class="fas fa-angle-down"></i>`}</span> ${node.data._directSubordinates}  </div>`
            })
            .linkUpdate(function (d, i, arr) {
                d3.select(this)
                    .attr("stroke", d => d.data._upToTheRootHighlighted ? '#152785' : '#E4E2E9')
                    .attr("stroke-width", d => d.data._upToTheRootHighlighted ? 5 : 1)
                if (d.data._upToTheRootHighlighted) {
                    d3.select(this).raise()
                }
            })
            .nodeContent(function (d, i, arr, state) {
                const parentNodeClass = (d.depth == 0) ? 'parent-node' : ''
                return `<div class="d3-node-container" style="width:${d.width}px;height:${d.height}px;">
                            <div class="d3-node-title-wrapper ${parentNodeClass}"><span class="d3-node-title">${d.data.name}</span></div>
                            <div class="d3-node-message"> ${d.data.message} </div>
                            <div class="d3-node-number"> ${d.data.number} </div>
                            <div class="d3-node-actions"><i class="fas fa-plus-square d3-node-action " onclick='openAddModal()'></i>&nbsp;<i class="fas fa-trash d3-node-action " onclick='openDeleteModal()'></i></div>
                        </div>
                        `;
                
            })
            .render()
}
