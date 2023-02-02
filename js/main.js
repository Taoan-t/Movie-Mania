/********************************************************************************* 
* WEB422 – Assignment 2 
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source 
* (including web sites) or distributed to other students. 
* 
* Name: Qian Tang  Student ID: 124746207  Date: 2023-02-01 
* ********************************************************************************/
let page=1;
const perPage=10;

//The code within main.js must be excuted when the DOM IS READY
document.addEventListener("DOMContentLoaded",function(){
    loadMovieData();

    //Click event for the "previous page" pagination button
    document.querySelector("#previous-page").addEventListener("click",e=>{     
        if(page>1){
            page-=1;
            loadMovieData();
        }    
    });
    
    //Click event for the "next page" pagination button
    document.querySelector("#next-page").addEventListener("click",e=>{
        page+=1;        
        loadMovieData();
    });

    //Submit event for the "searchForm" form
    document.querySelector("#searchForm").addEventListener("submit",e=>{
        e.preventDefault();
        loadMovieData(document.querySelector("#title").value);
    });

    //Click event for the "clearForm" button
    document.querySelector("#clearForm").addEventListener("click",e=>{
        //clear the input value
        document.getElementById("title").value="";
        loadMovieData();
    })

});    

function loadMovieData(title = null){
    // load data by getting the url to make a "fetch" request to the published API
    let url=getUrl(title);
  
    fetch(url).then((res)=>res.json()).then((data)=>{
        createMovieRows(data);
        updateCurrentPage();     
        //adding click events to each of the newly created movie rows
        document.querySelectorAll("#moviesTable tbody tr").forEach((row)=>{
            addClickEventToRow(row);
        });
        // document.querySelectorAll("#moviesTable tbody tr").map(row=>{
        //     addClickEventToRow(row);
        // }); 
        // why using map() doesn't work here?
    });
}

function getUrl(title){
    let pagination= document.querySelector(".pagination");
    // if title=null, remove "d-none" to show the pagination control, 
    // otherwise, add "d-none" to hide it
    pagination.classList.toggle("d-none",title);

    if(title){
        // must set the page value to 1, otherwise it will not show the search result after page 1
        page=1;
        return url=`https://nutty-gaiters-slug.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`;
    }else{
        return url=`https://nutty-gaiters-slug.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
    }
}

function createMovieRows(data){
    let movieRows=`
        ${data.map(movie=>(
            `<tr data-id="${movie._id}">
                <td>${movie.year}</td>
                <td>${movie.title}</td>
                <td>${movie.plot ? movie.plot:"N/A"}</td>
                <td>${movie.rated ? movie.rated: "N/A"}</td>
                <td>${Math.floor(movie.runtime/ 60) +":" + (movie.runtime % 60).toString().padStart(2, '0')}</td>
            </tr>`
        )).join('')}`;
    //update the newly created <tr> elements to the moviesTable
    document.querySelector("#moviesTable tbody").innerHTML=movieRows;
}

function updateCurrentPage(){
    let currentPage=`${page}`;
    document.querySelector("#current-page").innerHTML=currentPage;
}

//Adding Click Events & Loading / Displaying Movie Data
function addClickEventToRow(row){
    row.addEventListener("click",e=>{
        let dataId=row.getAttribute("data-id");

        fetch(`https://nutty-gaiters-slug.cyclic.app/api/movies/${dataId}`)
        .then(res=>res.json())
        .then(data=>{
            setModalTitle(data);
            setModalBody(data); 
            showModal();
        });
    });
}

//Set the "modal-title" to show the title of the movie
function setModalTitle(data){
    let modalTitle=`${data.title}`;
    document.querySelector("#detailsModal .modal-title").innerHTML=modalTitle;
}

//Set the "modal-body" to show the details of the movie using the specific format
function setModalBody(data){
    let modalBody=`                   
                <img class="img-fluid w-100" src="${data.poster}"><br><br>
                <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
                <p>${data.fullplot}</p>
                <strong>Cast:</strong> ${data.cast.length ? data.cast.join(', '):"N/A"}<br><br>
                <strong>Awards:</strong> ${data.awards.text}<br>
                <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes} votes)`;
    
    document.querySelector("#detailsModal .modal-body").innerHTML=modalBody;
}

//Using the bootstrap.modal() function to populate the modal window
function showModal(){
    let modal = new bootstrap.Modal(document.getElementById('detailsModal'), {
        backdrop: 'static',
        keyboard: false,
      });
      
    modal.show();
}







