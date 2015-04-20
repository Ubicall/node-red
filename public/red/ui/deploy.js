/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

RED.deploy = (function() {

    var deploymentTypes = {
        "save":{img:"images/deploy-full-o.png"},
        "full":{img:"images/deploy-full-o.png"},
        "nodes":{img:"images/deploy-nodes-o.png"},
        "flows":{img:"images/deploy-flows-o.png"}
    }

    var deploymentType = "full";
    var deploy=false;

    function changeDeploymentType(type) {
        deploymentType = type;
        $("#btn-deploy img").attr("src",deploymentTypes[type].img);
    }

    function init() {

        var saveButton = $('<li><span class="deploy-button-group button-group">'+
        '<a id="btn-save" class="action-deploy disabled" href="#"><img id="btn-icn-save" ' +
        'src="images/deploy-full-o.png"> <span>Save</span></a></span></li>').prependTo(".header-toolbar");

        var deployButton = $('<li><span class="deploy-button-group button-group">'+
          '<a id="btn-deploy" class="action-deploy disabled" href="#"><img id="btn-icn-deploy" src="images/deploy-full-o.png"> <span>Deploy</span></a>'+
          '<a id="btn-deploy-options"  data-toggle="dropdown"  class="" href="#"><i class="fa fa-caret-down"></i></a>'+
          '</span></li>').prependTo(".header-toolbar");

        $('#btn-deploy').click(function() { deploy = true ;save(undefined,true); });
        $('#btn-save').click(function() {  deploy = false ;save(true,false); });

        $( "#node-dialog-confirm-deploy" ).dialog({
                title: "Confirm save",
                modal: true,
                autoOpen: false,
                width: 530,
                height: 230,
                buttons: [
                    {
                        text: "Confirm save",
                        click: function() {
                            save(true,false);
                            $( this ).dialog( "close" );
                        }
                    },
                    {
                        text: "Cancel",
                        click: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                ]
        });

        RED.menu.init({id:"btn-deploy-options",
            options: [
                {id:"btn-deploy-full",toggle:"deploy-type",icon:"images/deploy-full.png",label:"Full",sublabel:"Deploys everything in the workspace",onselect:function(s) { if(s){changeDeploymentType("full")}}},
                {id:"btn-deploy-flow",toggle:"deploy-type",icon:"images/deploy-flows.png",label:"Modified Flows",sublabel:"Only deploys flows that contain changed nodes", onselect:function(s) {if(s){changeDeploymentType("flows")}}},
                {id:"btn-deploy-node",toggle:"deploy-type",icon:"images/deploy-nodes.png",label:"Modified Nodes",sublabel:"Only deploys nodes that have changed",onselect:function(s) { if(s){changeDeploymentType("nodes")}}}
            ]
        });

        RED.nodes.on('change',function(state) {
            if (state.dirty) {
                window.onbeforeunload = function() {
                    return "You have undeployed or unsaved changes.\n\nLeaving this page will lose these changes.";
                }
                $("#btn-deploy").removeClass("disabled");
                $("#btn-save").removeClass("disabled");
            } else {
                window.onbeforeunload = null;
                if(deploy){
                    $("#btn-deploy").addClass("disabled");
                }else{
                    $("#btn-save").addClass("disabled");
                }
            }
        });
    }

    function save(force,deploy) {
        if (RED.nodes.dirty() || true) {
            //$("#debug-tab-clear").click();  // uncomment this to auto clear debug on deploy

            var nns = RED.nodes.createCompleteNodeSet();

            if (!force || deploy) { // must validate before deploy
                var invalid = false;
                var inValidNodes = [];
                RED.nodes.eachNode(function(node) {
                    invalid = invalid || !node.valid;
                    if (node.type === "unknown") {
                        if (inValidNodes.indexOf(node.name) == -1) {
                            inValidNodes.push(node.name);
                        }
                        invalid = true;
                    }else if(!node.valid){
                        inValidNodes.push(node.type + " id " + node.id);
                    }
                });

                if(! invalid){
                    var logical_validate = RED.nodes.validateNodes(nns);
                    invalid = ! logical_validate.valid;
                    inValidNodes = inValidNodes.concat(logical_validate.Nodes);
                }

                if (invalid) {
                    if (inValidNodes.length > 0 ) {
                        $( "#node-dialog-confirm-deploy-config" ).hide();
                        $( "#node-dialog-confirm-deploy-unknown" ).show();
                        var list = "<li>"+inValidNodes.join("</li><li>")+"</li>";
                        $( "#node-dialog-confirm-deploy-unknown-list" ).html(list);
                    }else {
                        $( "#node-dialog-confirm-deploy-config" ).show();
                        $( "#node-dialog-confirm-deploy-unknown" ).hide();
                    }
                    $( "#node-dialog-confirm-deploy" ).dialog( "open" );
                    return;
                }
            }

            if(deploy){
                $("#btn-icn-deploy").removeClass('fa-download');
                $("#btn-icn-deploy").addClass('spinner');
            }

            $("#btn-icn-save").removeClass('fa-download');
            $("#btn-icn-save").addClass('spinner');

            RED.nodes.dirty(false);

            $.ajax({
                url:"flows",
                type: "POST",
                data: JSON.stringify(nns),
                contentType: "application/json; charset=utf-8",
                headers: {
                    "Node-RED-Deployment-Type":deploymentType,
                    "Node-RED-Deploy-Save":deploy?"deploy":"save"
                }
            }).done(function(data,textStatus,xhr) {
                if(deploy){
                    RED.notify("Successfully deployed","success");
                }else{
                    RED.notify("Successfully saved","success");
                }
                RED.nodes.eachNode(function(node) {
                    if (node.changed) {
                        node.dirty = true;
                        node.changed = false;
                    }
                    if(node.credentials) {
                        delete node.credentials;
                    }
                });
                RED.nodes.eachConfig(function (confNode) {
                    if (confNode.credentials) {
                        delete confNode.credentials;
                    }
                });
                // Once deployed, cannot undo back to a clean state
                RED.history.markAllDirty();
                RED.view.redraw();
            }).fail(function(xhr,textStatus,err) {
                RED.nodes.dirty(true);
                if (xhr.responseText) {
                    RED.notify("<strong>Error</strong>: "+xhr.responseJSON.message,"error");
                } else {
                    RED.notify("<strong>Error</strong>: no response from server","error");
                }
            }).always(function() {
                if(deploy){
                    $("#btn-icn-deploy").removeClass('fa-download');
                    $("#btn-icn-deploy").addClass('spinner');
                }
            });
        }
    }
    return {
        init: init
    }
})();
