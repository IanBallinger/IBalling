import * as pdfjsLib from 'pdfjs-dist';

const publicUrl = new URL(window.location.href)
const baseurl = publicUrl.origin


function IballingHeader() : JSX.Element {  //my intro
    return (
        <header>
            <h1>Ian Ballinger's Research Portfolio</h1>
            <p>
                Hi, I'm a full-ftack Electrical/Software Engineer from Boston. <br/>

                I'm not a web designer, But I'll be making this website prettier over the next few weeks. It's self hosted too!<br/>
                
                You can follow my progress on <a href="https://github.com/IanBallinger/IBalling">Github</a>.
            </p>
        </header>
    );
}

function PDFpage(url:string, pagenumber:number){
    return (
        <div>
            <iframe 
                src={`${url}#page=${pagenumber}`}
                width="100%" 
                //height="90%" 
                style={{ //cernter it, fill the full screen width, and leave a little room for the header and footer
                    border: "none",
                    margin: "auto",
                    display: "block",
                    width: "100%",
                    height: "70vh",
                }}
            />
        </div>
    );
}

function IballingContent() : JSX.Element  {  //pdf viewer
    const pdfurl = `${baseurl + "/assets/iballingPortfolioReadable.pdf"}`
    const pages = 13; // 1..13

    //if on mobule, return the canvas
    //here be dragons :)
    if (window.innerWidth < 800) {
        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${baseurl}/assets/pdfjslib-deps/pdf.worker.mjs`;

        var loadingTask = pdfjsLib.getDocument(pdfurl);
        loadingTask.promise.then(async function(pdf) {
            // now actually render it to the canvas
            for (var i = 1; i <= pages; i++) {
                let page = await pdf.getPage(i)
                // now draw the page to the canvas, but block until the page is rendered

                var scale = 1;
                var viewport = page.getViewport({scale: scale});

                //calc scale for canvas size
                var canvas = document.getElementById(`the-canvas-${i}`) as HTMLCanvasElement;
                scale = canvas.width / viewport.width;

                // Prepare canvas using PDF page dimensions scaled to fit screen
                var context = canvas.getContext('2d') as CanvasRenderingContext2D;
                context.scale(scale, scale);

                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                await page.render(renderContext).promise;
            }
        });
        //return the pages canvases to render to
        var rows:any= [];
        for (var i = 1; i <= pages; i++) {
            rows.push(<div><canvas id={`the-canvas-${i}`} width={'1000px'} height={'750px'} style={{width:"95%", height:'auto'}}></canvas><br/></div>)
        }
        return (<div>{rows}</div>);
    }else{
        //if on desktop, return the normal pdf viewer
        return (
            <main>
                <div>
                    {PDFpage(pdfurl, 1)}
                </div>
            </main>
        );
    }

    
}


function IballingFooter() : JSX.Element {  //my links
    return (
        <footer>
            I'm pretty much off the grid when it comes to social media, but you can message me on <a href="https://www.linkedin.com/in/iballing">LinkedIn</a>.
        </footer>
    );
}


export function IballingHome() {
  return (
    <div>
        <IballingHeader />
        <IballingContent />
        <IballingFooter />
    </div>
  );
}

export default IballingHome;