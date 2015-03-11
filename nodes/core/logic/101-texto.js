module.exports = function(RED) {
    function textoNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
           node.send(msg);
        });
    }
    RED.nodes.registerType("texto",textoNode);
}