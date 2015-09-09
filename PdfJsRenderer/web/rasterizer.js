﻿function renderPdf(filePath) {
    
    if (window.external && filePath && PDFJS) {
        //PDFJS.disableWorker = true;
        PDFJS.getDocument(filePath).then(function (pdf) {
            var info = {
                id: pdf.fingerprint,
                pages: pdf.numPages
            };
            window.external.PdfOpened(info.id, info.pages);
            renderPage(pdf, 1, info.pages);

        }, function (error) {
            alert('failed doc');
            window.external.Failed(error);
        });
    }
}

function renderPage(pdf, pageNum, totalPages) {
    pdf.getPage(pageNum).then(function (page) {
        
        var desiredWidth = 2000;
        var viewport = page.getViewport(1);
        var scale = desiredWidth / viewport.width;
        var scaledViewport = page.getViewport(scale);
        
        var canvas = document.getElementById('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        
        var renderContext = {
            canvasContext: context,
            viewport: scaledViewport
        };
        page.render(renderContext).promise.then(function () {
            var pngData = canvas.toDataURL("image/png");
            //alert(pngData);
            window.external.PageRendered(pageNum, pngData);
            
            if (pageNum < totalPages) {
                renderPage(pdf, pageNum + 1, totalPages);
            } else {
                window.external.RenderCompleted();
            }

        }, function (error) {
            window.external.Failed(error);
        });
		
		
    }, function (error) {
        window.external.Failed(error);
    });
}