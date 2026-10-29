const AlbumFunction = function(){
    let Album_Name = document.querySelector('.album-name').textContent;
    switch(Album_Name){
        case "Marriage":
            Preloader();
            window.location.href = "album/index.html#Marriage";
            break;
        case "Enticement":
            Preloader();
            window.location.href = "album/index.html#Enticement";
            break
        case "Bizarre":
            Preloader();
            window.location.href = "album/index.html#Bizarre";
            break;
        default:
            console.log(Album_Name);
            break;
    }
}

const Cheatsheet = function(){
    Preloader();
    window.location.href = "cheatsheet/index.html";
}

function Preloader(){
    document.writeln("loading... please wait");
}