class Renderer{
    render(placeToRender, whatToRender) {   //placTorender = waar je iets wilt renderen en WhatToRender is wat je wilt renderen
        document.querySelector(placeToRender).appendChild(whatToRender);  // hier heb je de render , dit is makkelijk om te herbruiken als je iets wilt renderen
    }
}