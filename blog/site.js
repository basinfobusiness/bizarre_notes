const AlbumFunction = function(){
    let Album_Name = document.querySelector('.album-name').textContent;
    switch(Album_Name){
        case "Marriage":
            Preloader();
            window.location.href = "http://bizarrenotes.freepage.cc/album/index.html#Marriage";
            break;
        case "Enticement":
            Preloader();
            window.location.href = "http://bizarrenotes.freepage.cc/album/index.html#Enticement";
            break
        case "Bizarre":
            Preloader();
            window.location.href = "http://bizarrenotes.freepage.cc/album/index.html#Bizarre";
            break;
        default:
            console.log(Album_Name);
            break;
    }
}

const Cheatsheet = function(){
    Preloader();
    window.location.href = "http://bizarrenotes.freepage.cc/cheatsheet/index.html";
}

function Preloader(){
    document.writeln("loading... please wait");
}

document.addEventListener("DOMContentLoaded", function(){
    const searchModal = document.getElementById("searchModal");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchStatus = document.getElementById("searchStatus");
    const searchResults = document.getElementById("searchResults");

    if (!searchModal || !searchForm || !searchInput || !searchStatus || !searchResults) {
        return;
    }

    const searchableNotes = Array.from(document.querySelectorAll(
        "main article.blog-post, main > .p-4, main > .row.mb-2 > div"
    )).map(function(note, index){
        if (!note.id) {
            note.id = "search-note-" + (index + 1);
        }

        const heading = note.querySelector("h1, h2, h3");
        const title = heading ? heading.textContent.trim() : "Note";
        const excerptContent = note.cloneNode(true);
        excerptContent.querySelectorAll("h1, h2, h3, .blog-post-meta").forEach(function(element){
            element.remove();
        });
        const content = note.textContent.trim().replace(/\s+/g, " ");
        const excerpt = excerptContent.textContent.trim().replace(/\s+/g, " ");

        return {
            element: note,
            title: title,
            content: content,
            excerpt: excerpt || content,
            normalizedTitle: normalizeSearchText(title),
            normalizedContent: normalizeSearchText(content)
        };
    });
    let pendingSearchTarget = "";

    function normalizeSearchText(text){
        return text.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
    }

    function createExcerpt(content, terms){
        const searchableContent = content.toLocaleLowerCase();
        const firstMatch = terms.reduce(function(earliest, term){
            const position = searchableContent.indexOf(term);
            return position !== -1 && (earliest === -1 || position < earliest) ? position : earliest;
        }, -1);

        if (firstMatch === -1 || content.length <= 180) {
            return content.length > 180 ? content.slice(0, 180) + "…" : content;
        }

        const start = Math.max(0, firstMatch - 60);
        const end = Math.min(content.length, start + 180);
        return (start > 0 ? "…" : "") + content.slice(start, end) + (end < content.length ? "…" : "");
    }

    function updateSearchResults(){
        const query = normalizeSearchText(searchInput.value);
        searchResults.replaceChildren();

        if (!query) {
            searchStatus.textContent = "Type a word or phrase to search the notes.";
            return;
        }

        const terms = query.split(/\s+/);
        const matches = searchableNotes.map(function(note){
            const matchingTerms = terms.filter(function(term){
                return note.normalizedTitle.includes(term) || note.normalizedContent.includes(term);
            });
            const titleMatches = terms.filter(function(term){
                return note.normalizedTitle.includes(term);
            }).length;
            const hasTitlePhrase = note.normalizedTitle.includes(query);
            const hasContentPhrase = note.normalizedContent.includes(query);

            return {
                note: note,
                score: matchingTerms.length === terms.length
                    ? titleMatches * 10 + (hasTitlePhrase ? 100 : 0) + (hasContentPhrase ? 20 : 0)
                    : 0,
                matchesAllTerms: matchingTerms.length === terms.length
            };
        }).filter(function(match){
            return match.matchesAllTerms;
        }).sort(function(first, second){
            return second.score - first.score;
        });

        if (matches.length === 0) {
            searchStatus.textContent = "No notes found for “" + searchInput.value.trim() + "”.";
            return;
        }

        searchStatus.textContent = matches.length + (matches.length === 1 ? " note found." : " notes found.");
        matches.forEach(function(match){
            const note = match.note;
            const item = document.createElement("li");
            const link = document.createElement("a");
            const title = document.createElement("strong");
            const excerpt = document.createElement("span");

            link.className = "list-group-item list-group-item-action";
            const pagePath = window.location.pathname.replace(/^\/blog(?=\/|$)/, "") || "/";
            link.href = new URL(
                pagePath + window.location.search + "#" + note.element.id,
                "http://bizarrenotes.freepage.cc/"
            ).href;
            title.className = "d-block";
            title.textContent = note.title;
            excerpt.className = "small text-body-secondary";
            excerpt.textContent = createExcerpt(note.excerpt, terms);
            link.append(title, excerpt);
            item.append(link);
            searchResults.append(item);
        });
    }

    searchInput.addEventListener("input", updateSearchResults);
    searchForm.addEventListener("submit", function(event){
        event.preventDefault();
        updateSearchResults();
    });
    searchResults.addEventListener("click", function(event){
        const link = event.target instanceof Element
            ? event.target.closest("a")
            : null;

        if (link && searchResults.contains(link)) {
            event.preventDefault();
            pendingSearchTarget = link.hash;
            window.bootstrap.Modal.getOrCreateInstance(searchModal).hide();
        }
    });
    searchModal.addEventListener("shown.bs.modal", function(){
        searchInput.focus();
    });
    searchModal.addEventListener("hidden.bs.modal", function(){
        if (pendingSearchTarget) {
            window.location.hash = pendingSearchTarget;
            pendingSearchTarget = "";
        }
    });
});