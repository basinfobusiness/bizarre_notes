const AlbumFunction = function(){
    Preloader();
    window.location.href = "album/index.html";
}

const Cheatsheet = function(){
    Preloader();
    window.location.href = "cheatsheet/index.html";
}

function Preloader(){
    document.writeln("loading... please wait");
}