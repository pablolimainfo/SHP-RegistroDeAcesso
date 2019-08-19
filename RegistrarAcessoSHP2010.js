/* ************************************************************
This script store access log in Sharepoint 2010 list.

Requirements:
- Sharepoint list named "Audiencia" with text columns: "Usuario" and "URL".

How to use:
- Add a <script/> reference to this file at Sharepoint Page or Master Page.
************************************************************ */


ExecuteOrDelayUntilScriptLoaded(getDisplayName,"sp.js");

$(document).ready(function(){
	setTimeout(function(){
		RegistrarAcesso();
	}, 2000);
});

var currentUser;

function getDisplayName(){
    this.clientContext = new SP.ClientContext.get_current();
    this.oWeb = clientContext.get_web();
    currentUser = this.oWeb.get_currentUser();
    this.clientContext.load(currentUser);
    this.clientContext.executeQueryAsync(Function.createDelegate(this,this.onQuerySucceeded), Function.createDelegate(this,this.onQueryFailed));
}

function onQuerySucceeded() {
    currentUser = currentUser.get_loginName();
}

function onQueryFailed(sender, args) {
    //alert('Request failed. \nError: ' + args.get_message() + '\nStackTrace: ' + args.get_stackTrace());
    currentUser = "Não foi possí­vel identificar";
}

function GetCurrentDateTime()
{
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    return dateTime;
}

function RegistrarAcesso()
{  
    console.log("Iniciou a inclusão do item");
    var listName = "Audiencia";    
    var currentUserLoginName;

    var urlAtual = window.location.href;
    var dtAcesso = GetCurrentDateTime();
    var urlPrefix;

    try{
        var urlPrefix = window.location.protocol + "//" + window.location.host + _spPageContextInfo.siteServerRelativeUrl;
        console.log("urlPrefix: " + urlPrefix);
    }
    catch(err){
        console.log("Não foi possível obter a URL do site.");
    }
    
    /// Sharepoint 2010
    var urlAPI = urlPrefix + "/_vti_bin/listdata.svc/" + listName;
    
    console.log("Iniciou busca pelo usuário atual.");

    console.log("Valor de currentUserLoginName: " + currentUser);
    CreateListItem(urlAPI, listName, "Teste", currentUser, urlAtual);
}  

function CreateListItem(url, listName, title, usuario, urlAtual){
    console.log("Iniciou: CreateListItem");

    // Info debug:
    console.log("Gravando em: " + url);
    console.log("... listName: " + listName);
    console.log("... title: " + title);
    console.log("... usuario: " + usuario);
    console.log("... urlAtual: " + urlAtual);
    //

    var listItemProperties = {
        'Usuario': usuario,  
        'URL': urlAtual  
    };

    $.ajax({  
        // URL to post data into sharepoint list  
        url: url,  
        type: "POST", //Specifies the operation to create the list item  
        processData: false,
        data: JSON.stringify(listItemProperties),  
        headers: {  
            "accept": "application/json;odata=verbose", //It defines the Data format   
            "content-type": "application/json;odata=verbose", //It defines the content type as JSON  
            "X-RequestDigest": $("#__REQUESTDIGEST").val() //It gets the digest value   
        },  
        success: function(data) {  
            console.log("Sucesso");  
        },  
        error: function(error) {  
            console.log(JSON.stringify(error));  
        }  
    });  
}

