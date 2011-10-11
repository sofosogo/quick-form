$(document).ready(function() {

module("common.Form");
var basic = 
'<div>\
    <input type="text" name="name"/>\
    <textarea name="desc"></textarea>\
    <div bind="details">\
        <input type="checkbox" name="language" value="Chinese" />Chinese\
        <input type="checkbox" name="language" value="English" />English\
    </div>\
    <div bind="details">\
        <input type="radio" name="gender" value="male" />male\
        <input type="radio" name="gender" value="female" />female\
    </div>\
    <div bind="details">\
        <select name="school">\
            <option value="">Please select</option>\
            <option value="HFUT">HFUT</option>\
            <option value="NOT">NOT</option>\
        </select>\
        <select name="sports" multiple>\
            <option value="">Please select</option>\
            <option value="Basketball">Basketball</option>\
            <option value="Football">Football</option>\
            <option value="PingPong">PingPong<ption>\
        </select>\
    <div>\
</div>';
test("create-basic", function(){
    var user = { name: "sofosogo", desc:"SE", details:{language: ["English", "Chinese"], gender: "male", school: "HFUT",
        sports: ["Basketball", "PingPong"]} };
    var form = Form.create( basic );
    form.fill( user );
    var fetched = form.fetch();
    same( fetched.name, "sofosogo" );
    same( fetched.desc, "SE" );
    same( fetched.details.language.length, 2 );
    same( fetched.details.gender, "male" );
    same( fetched.details.school, "HFUT" );
    same( fetched.details.sports.length, 2 );
    
    fetched = form.clean().fetch();
    same( fetched.name, "" );
    same( fetched.desc, "" );
    same( fetched.details.language.length, 0 );
    same( typeof fetched.details.gender, "undefined" );
    same( fetched.details.school, "" );
    same( fetched.details.sports.length, 0 );
});

});