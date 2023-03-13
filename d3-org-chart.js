!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("d3-selection"), require("d3-array"), require("d3-hierarchy"), require("d3-zoom"), require("d3-flextree"), require("d3-shape")) : "function" == typeof define && define.amd ? define(["exports", "d3-selection", "d3-array", "d3-hierarchy", "d3-zoom", "d3-flextree", "d3-shape"], e) : e(t.d3 = t.d3 || {}, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3)
}(this, function(t, e, a, n, i, r, o) {
    "use strict";
    const u = {
        selection: e.selection,
        select: e.select,
        max: a.max,
        min: a.min,
        sum: a.sum,
        cumsum: a.cumsum,
        tree: n.tree,
        stratify: n.stratify,
        zoom: i.zoom,
        zoomIdentity: i.zoomIdentity,
        linkHorizontal: o.linkHorizontal,
        flextree: r.flextree
    };
    t.OrgChart = class {
        constructor() {
            const a = {
                id: "ID" + Math.floor(1e6 * Math.random()),
                firstDraw: !0,
                ctx: document.createElement("canvas").getContext("2d"),
                expandLevel: 1,
                nodeDefaultBackground: "none",
                lastTransform: {
                    x: 0,
                    y: 0,
                    k: 1
                },
                allowedNodesCount: {},
                zoomBehavior: null,
                svgWidth: 800,
                svgHeight: window.innerHeight - 100,
                container: "body",
                data: null,
                connections: [],
                defaultFont: "Helvetica",
                nodeId: t=>t.nodeId || t.id,
                parentNodeId: t=>t.parentNodeId || t.parentId,
                rootMargin: 40,
                nodeWidth: t=>250,
                nodeHeight: t=>150,
                neighbourMargin: (t,e)=>80,
                siblingsMargin: t=>20,
                childrenMargin: t=>60,
                compactMarginPair: t=>100,
                compactMarginBetween: t=>20,
                nodeButtonWidth: t=>40,
                nodeButtonHeight: t=>40,
                nodeButtonX: t=>-20,
                nodeButtonY: t=>-20,
                linkYOffset: 30,
                pagingStep: t=>5,
                minPagingVisibleNodes: t=>2e3,
                scaleExtent: [.001, 20],
                duration: 400,
                imageName: "Chart",
                setActiveNodeCentered: !0,
                layout: "top",
                compact: !0,
                onZoomStart: t=>{}
                ,
                onZoom: t=>{}
                ,
                onZoomEnd: t=>{}
                ,
                onNodeClick: t=>t,
                nodeContent: t=>`<div style="padding:5px;font-size:10px;">Sample Node(id=${t.id}), override using <br/> 
            <code>chart.nodeContent({data}=>{ <br/>
             &nbsp;&nbsp;&nbsp;&nbsp;return '' // Custom HTML <br/>
             })</code>
             <br/> 
             Or check different <a href="https://github.com/bumbeishvili/org-chart#jump-to-examples" target="_blank">layout examples</a>
             </div>`,
                buttonContent: ({node: e, state: t})=>{
                    return `<div style="border:1px solid #E4E2E9;border-radius:3px;padding:3px;font-size:9px;margin:auto auto;background-color:white"> ${{
                        left: t=>t ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.283 3.50094L6.51 11.4749C6.37348 11.615 6.29707 11.8029 6.29707 11.9984C6.29707 12.194 6.37348 12.3819 6.51 12.5219L14.283 20.4989C14.3466 20.5643 14.4226 20.6162 14.5066 20.6516C14.5906 20.6871 14.6808 20.7053 14.772 20.7053C14.8632 20.7053 14.9534 20.6871 15.0374 20.6516C15.1214 20.6162 15.1974 20.5643 15.261 20.4989C15.3918 20.365 15.4651 20.1852 15.4651 19.9979C15.4651 19.8107 15.3918 19.6309 15.261 19.4969L7.9515 11.9984L15.261 4.50144C15.3914 4.36756 15.4643 4.18807 15.4643 4.00119C15.4643 3.81431 15.3914 3.63482 15.261 3.50094C15.1974 3.43563 15.1214 3.38371 15.0374 3.34827C14.9534 3.31282 14.8632 3.29456 14.772 3.29456C14.6808 3.29456 14.5906 3.31282 14.5066 3.34827C14.4226 3.38371 14.3466 3.43563 14.283 3.50094V3.50094Z" fill="#716E7B" stroke="#716E7B"/>
                      </svg></span><span style="color:#716E7B">${e.data._directSubordinatesPaging} </span></div>` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.989 3.49944C7.85817 3.63339 7.78492 3.8132 7.78492 4.00044C7.78492 4.18768 7.85817 4.36749 7.989 4.50144L15.2985 11.9999L7.989 19.4969C7.85817 19.6309 7.78492 19.8107 7.78492 19.9979C7.78492 20.1852 7.85817 20.365 7.989 20.4989C8.05259 20.5643 8.12863 20.6162 8.21261 20.6516C8.2966 20.6871 8.38684 20.7053 8.478 20.7053C8.56916 20.7053 8.6594 20.6871 8.74338 20.6516C8.82737 20.6162 8.90341 20.5643 8.967 20.4989L16.74 12.5234C16.8765 12.3834 16.9529 12.1955 16.9529 11.9999C16.9529 11.8044 16.8765 11.6165 16.74 11.4764L8.967 3.50094C8.90341 3.43563 8.82737 3.38371 8.74338 3.34827C8.6594 3.31282 8.56916 3.29456 8.478 3.29456C8.38684 3.29456 8.2966 3.31282 8.21261 3.34827C8.12863 3.38371 8.05259 3.43563 7.989 3.50094V3.49944Z" fill="#716E7B" stroke="#716E7B"/>
                          </svg></span><span style="color:#716E7B">${e.data._directSubordinatesPaging} </span></div>`,
                        bottom: t=>t ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M19.497 7.98903L12 15.297L4.503 7.98903C4.36905 7.85819 4.18924 7.78495 4.002 7.78495C3.81476 7.78495 3.63495 7.85819 3.501 7.98903C3.43614 8.05257 3.38462 8.12842 3.34944 8.21213C3.31427 8.29584 3.29615 8.38573 3.29615 8.47653C3.29615 8.56733 3.31427 8.65721 3.34944 8.74092C3.38462 8.82463 3.43614 8.90048 3.501 8.96403L11.4765 16.74C11.6166 16.8765 11.8044 16.953 12 16.953C12.1956 16.953 12.3834 16.8765 12.5235 16.74L20.499 8.96553C20.5643 8.90193 20.6162 8.8259 20.6517 8.74191C20.6871 8.65792 20.7054 8.56769 20.7054 8.47653C20.7054 8.38537 20.6871 8.29513 20.6517 8.21114C20.6162 8.12715 20.5643 8.05112 20.499 7.98753C20.3651 7.85669 20.1852 7.78345 19.998 7.78345C19.8108 7.78345 19.6309 7.85669 19.497 7.98753V7.98903Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="margin-left:1px;color:#716E7B" >${e.data._directSubordinatesPaging} </span></div>
                       ` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M11.457 8.07005L3.49199 16.4296C3.35903 16.569 3.28485 16.7543 3.28485 16.9471C3.28485 17.1398 3.35903 17.3251 3.49199 17.4646L3.50099 17.4736C3.56545 17.5414 3.64304 17.5954 3.72904 17.6324C3.81504 17.6693 3.90765 17.6883 4.00124 17.6883C4.09483 17.6883 4.18745 17.6693 4.27344 17.6324C4.35944 17.5954 4.43703 17.5414 4.50149 17.4736L12.0015 9.60155L19.4985 17.4736C19.563 17.5414 19.6405 17.5954 19.7265 17.6324C19.8125 17.6693 19.9052 17.6883 19.9987 17.6883C20.0923 17.6883 20.1849 17.6693 20.2709 17.6324C20.3569 17.5954 20.4345 17.5414 20.499 17.4736L20.508 17.4646C20.641 17.3251 20.7151 17.1398 20.7151 16.9471C20.7151 16.7543 20.641 16.569 20.508 16.4296L12.543 8.07005C12.4729 7.99653 12.3887 7.93801 12.2954 7.89801C12.202 7.85802 12.1015 7.8374 12 7.8374C11.8984 7.8374 11.798 7.85802 11.7046 7.89801C11.6113 7.93801 11.527 7.99653 11.457 8.07005Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="margin-left:1px;color:#716E7B" >${e.data._directSubordinatesPaging} </span></div>
                    `,
                        right: t=>t ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M7.989 3.49944C7.85817 3.63339 7.78492 3.8132 7.78492 4.00044C7.78492 4.18768 7.85817 4.36749 7.989 4.50144L15.2985 11.9999L7.989 19.4969C7.85817 19.6309 7.78492 19.8107 7.78492 19.9979C7.78492 20.1852 7.85817 20.365 7.989 20.4989C8.05259 20.5643 8.12863 20.6162 8.21261 20.6516C8.2966 20.6871 8.38684 20.7053 8.478 20.7053C8.56916 20.7053 8.6594 20.6871 8.74338 20.6516C8.82737 20.6162 8.90341 20.5643 8.967 20.4989L16.74 12.5234C16.8765 12.3834 16.9529 12.1955 16.9529 11.9999C16.9529 11.8044 16.8765 11.6165 16.74 11.4764L8.967 3.50094C8.90341 3.43563 8.82737 3.38371 8.74338 3.34827C8.6594 3.31282 8.56916 3.29456 8.478 3.29456C8.38684 3.29456 8.2966 3.31282 8.21261 3.34827C8.12863 3.38371 8.05259 3.43563 7.989 3.50094V3.49944Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="color:#716E7B">${e.data._directSubordinatesPaging} </span></div>` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M14.283 3.50094L6.51 11.4749C6.37348 11.615 6.29707 11.8029 6.29707 11.9984C6.29707 12.194 6.37348 12.3819 6.51 12.5219L14.283 20.4989C14.3466 20.5643 14.4226 20.6162 14.5066 20.6516C14.5906 20.6871 14.6808 20.7053 14.772 20.7053C14.8632 20.7053 14.9534 20.6871 15.0374 20.6516C15.1214 20.6162 15.1974 20.5643 15.261 20.4989C15.3918 20.365 15.4651 20.1852 15.4651 19.9979C15.4651 19.8107 15.3918 19.6309 15.261 19.4969L7.9515 11.9984L15.261 4.50144C15.3914 4.36756 15.4643 4.18807 15.4643 4.00119C15.4643 3.81431 15.3914 3.63482 15.261 3.50094C15.1974 3.43563 15.1214 3.38371 15.0374 3.34827C14.9534 3.31282 14.8632 3.29456 14.772 3.29456C14.6808 3.29456 14.5906 3.31282 14.5066 3.34827C14.4226 3.38371 14.3466 3.43563 14.283 3.50094V3.50094Z" fill="#716E7B" stroke="#716E7B"/>
                       </svg></span><span style="color:#716E7B">${e.data._directSubordinatesPaging} </span></div>`,
                        top: t=>t ? `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.457 8.07005L3.49199 16.4296C3.35903 16.569 3.28485 16.7543 3.28485 16.9471C3.28485 17.1398 3.35903 17.3251 3.49199 17.4646L3.50099 17.4736C3.56545 17.5414 3.64304 17.5954 3.72904 17.6324C3.81504 17.6693 3.90765 17.6883 4.00124 17.6883C4.09483 17.6883 4.18745 17.6693 4.27344 17.6324C4.35944 17.5954 4.43703 17.5414 4.50149 17.4736L12.0015 9.60155L19.4985 17.4736C19.563 17.5414 19.6405 17.5954 19.7265 17.6324C19.8125 17.6693 19.9052 17.6883 19.9987 17.6883C20.0923 17.6883 20.1849 17.6693 20.2709 17.6324C20.3569 17.5954 20.4345 17.5414 20.499 17.4736L20.508 17.4646C20.641 17.3251 20.7151 17.1398 20.7151 16.9471C20.7151 16.7543 20.641 16.569 20.508 16.4296L12.543 8.07005C12.4729 7.99653 12.3887 7.93801 12.2954 7.89801C12.202 7.85802 12.1015 7.8374 12 7.8374C11.8984 7.8374 11.798 7.85802 11.7046 7.89801C11.6113 7.93801 11.527 7.99653 11.457 8.07005Z" fill="#716E7B" stroke="#716E7B"/>
                        </svg></span><span style="margin-left:1px;color:#716E7B">${e.data._directSubordinatesPaging} </span></div>
                        ` : `<div style="display:flex;"><span style="align-items:center;display:flex;"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.497 7.98903L12 15.297L4.503 7.98903C4.36905 7.85819 4.18924 7.78495 4.002 7.78495C3.81476 7.78495 3.63495 7.85819 3.501 7.98903C3.43614 8.05257 3.38462 8.12842 3.34944 8.21213C3.31427 8.29584 3.29615 8.38573 3.29615 8.47653C3.29615 8.56733 3.31427 8.65721 3.34944 8.74092C3.38462 8.82463 3.43614 8.90048 3.501 8.96403L11.4765 16.74C11.6166 16.8765 11.8044 16.953 12 16.953C12.1956 16.953 12.3834 16.8765 12.5235 16.74L20.499 8.96553C20.5643 8.90193 20.6162 8.8259 20.6517 8.74191C20.6871 8.65792 20.7054 8.56769 20.7054 8.47653C20.7054 8.38537 20.6871 8.29513 20.6517 8.21114C20.6162 8.12715 20.5643 8.05112 20.499 7.98753C20.3651 7.85669 20.1852 7.78345 19.998 7.78345C19.8108 7.78345 19.6309 7.85669 19.497 7.98753V7.98903Z" fill="#716E7B" stroke="#716E7B"/>
                        </svg></span><span style="margin-left:1px;color:#716E7B">${e.data._directSubordinatesPaging} </span></div>
                    `
                    }[t.layout](e.children)}  </div>`
                }
                ,
                pagingButton: (t,e,a,n)=>{
                    var n = n.pagingStep(t.parent)
                      , i = t.parent.data._pagingStep
                      , t = t.parent.data._directSubordinatesPaging - i;
                    return `
                   <div style="margin-top:90px;">
                      <div style="display:flex;width:170px;border-radius:20px;padding:5px 15px; padding-bottom:4px;;background-color:#E5E9F2">
                      <div><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.59 7.41L10.18 12L5.59 16.59L7 18L13 12L7 6L5.59 7.41ZM16 6H18V18H16V6Z" fill="#716E7B" stroke="#716E7B"/>
                      </svg>
                      </div><div style="line-height:2"> Show next ${Math.min(t, n)}  nodes </div></div>
                   </div>
                `
                }
                ,
                nodeUpdate: function(t, e, a) {
                    u.select(this).select(".node-rect").attr("stroke", t=>t.data._highlighted || t.data._upToTheRootHighlighted ? "#E27396" : "none").attr("stroke-width", t.data._highlighted || t.data._upToTheRootHighlighted ? 10 : 1)
                },
                linkUpdate: function(t, e, a) {
                    u.select(this).attr("stroke", t=>t.data._upToTheRootHighlighted ? "#E27396" : "#E4E2E9").attr("stroke-width", t=>t.data._upToTheRootHighlighted ? 5 : 1),
                    t.data._upToTheRootHighlighted && u.select(this).raise()
                },
                hdiagonal: function(t, e, a) {
                    var n = t.x
                      , t = t.y
                      , i = e.x
                      , e = e.y
                      , o = a && a.x || n
                      , a = a && a.y || t
                      , r = i - n < 0 ? -1 : 1
                      , d = e - t < 0 ? -1 : 1
                      , s = Math.abs(i - n) / 2 < 35 ? Math.abs(i - n) / 2 : 35
                      , s = Math.abs(e - t) / 2 < s ? Math.abs(e - t) / 2 : s
                      , l = (Math.abs(e - t),
                    Math.abs(i - n) / 2 - s);
                    return `
                          M ${o} ${a}
                          L ${o} ${t}
                          L ${n} ${t}
                          L ${n + l * r} ${t}
                          C ${n + l * r + s * r} ${t} 
                            ${n + l * r + s * r} ${t} 
                            ${n + l * r + s * r} ${t + s * d}
                          L ${n + l * r + s * r} ${e - s * d} 
                          C ${n + l * r + s * r}  ${e} 
                            ${n + l * r + s * r}  ${e} 
                            ${i - l * r}  ${e}
                          L ${i} ${e}
               `
                },
                diagonal: function(t, e, a, n={
                    sy: 0
                }) {
                    var i = t.x
                      , t = t.y
                      , o = e.x
                      , e = e.y
                      , r = a && a.x || i
                      , a = a && a.y || t
                      , d = o - i < 0 ? -1 : 1
                      , s = e - t < 0 ? -1 : 1
                      , n = (t += n.sy,
                    Math.abs(o - i) / 2 < 35 ? Math.abs(o - i) / 2 : 35)
                      , n = Math.abs(e - t) / 2 < n ? Math.abs(e - t) / 2 : n
                      , l = Math.abs(e - t) / 2 - n;
                    return `
                          M ${r} ${a}
                          L ${i} ${a}
                          L ${i} ${t}
                          L ${i} ${t + l * s}
                          C  ${i} ${t + l * s + n * s} ${i} ${t + l * s + n * s} ${i + n * d} ${t + l * s + n * s}
                          L ${i + (Math.abs(o - i) - 2 * n) * d + n * d} ${t + l * s + n * s}
                          C  ${o}  ${t + l * s + n * s} ${o}  ${t + l * s + n * s} ${o} ${e - l * s}
                          L ${o} ${e}
               `
                },
                defs: function(a, t) {
                    return `<defs>
                    ${t.map(t=>{
                        var e = this.getTextWidth(t.label, {
                            ctx: a.ctx,
                            fontSize: 2,
                            defaultFont: a.defaultFont
                        });
                        return `
                       <marker id="${t.from + "_" + t.to}" refX="${t._source.x < t._target.x ? -7 : 7}" refY="5" markerWidth="500"  markerHeight="500"  orient="${t._source.x < t._target.x ? "auto" : "auto-start-reverse"}" >
                       <rect rx=0.5 width=${t.label ? e + 3 : 0} height=3 y=1  fill="#E27396"></rect>
                       <text font-size="2px" x=1 fill="white" y=3>${t.label || ""}</text>
                       </marker>

                       <marker id="arrow-${t.from + "_" + t.to}"  markerWidth="500"  markerHeight="500"  refY="2"  refX="1" orient="${t._source.x < t._target.x ? "auto" : "auto-start-reverse"}" >
                       <path transform="translate(0)" d='M0,0 V4 L2,2 Z' fill='#E27396' />
                       </marker>
                    `
                    }
                    ).join("")}
                    </defs>
                    `
                },
                connectionsUpdate: function(t, e, a) {
                    u.select(this).attr("stroke", t=>"#E27396").attr("stroke-linecap", "round").attr("stroke-width", t=>"5").attr("pointer-events", "none").attr("marker-start", t=>`url(#${t.from + "_" + t.to})`).attr("marker-end", t=>`url(#arrow-${t.from + "_" + t.to})`)
                },
                linkGroupArc: u.linkHorizontal().x(t=>t.x).y(t=>t.y),
                layoutBindings: {
                    left: {
                        nodeLeftX: t=>0,
                        nodeRightX: t=>t.width,
                        nodeTopY: t=>-t.height / 2,
                        nodeBottomY: t=>t.height / 2,
                        nodeJoinX: t=>t.x + t.width,
                        nodeJoinY: t=>t.y - t.height / 2,
                        linkJoinX: t=>t.x + t.width,
                        linkJoinY: t=>t.y,
                        linkX: t=>t.x,
                        linkY: t=>t.y,
                        linkCompactXStart: t=>t.x + t.width / 2,
                        linkCompactYStart: t=>t.y + (t.compactEven ? t.height / 2 : -t.height / 2),
                        compactLinkMidX: (t,e)=>t.firstCompactNode.x,
                        compactLinkMidY: (t,e)=>t.firstCompactNode.y + t.firstCompactNode.flexCompactDim[0] / 4 + e.compactMarginPair(t) / 4,
                        linkParentX: t=>t.parent.x + t.parent.width,
                        linkParentY: t=>t.parent.y,
                        buttonX: t=>t.width,
                        buttonY: t=>t.height / 2,
                        centerTransform: ({rootMargin: t, centerY: e, scale: a})=>`translate(${t},${e}) scale(${a})`,
                        compactDimension: {
                            sizeColumn: t=>t.height,
                            sizeRow: t=>t.width,
                            reverse: t=>t.slice().reverse()
                        },
                        nodeFlexSize: ({height: t, width: e, siblingsMargin: a, childrenMargin: n, state: i, node: o})=>{
                            return i.compact && o.flexCompactDim ? [o.flexCompactDim[0], o.flexCompactDim[1]] : [t + a, e + n]
                        }
                        ,
                        zoomTransform: ({centerY: t, scale: e})=>`translate(0,${t}) scale(${e})`,
                        diagonal: this.hdiagonal.bind(this),
                        swap: t=>{
                            var e = t.x;
                            t.x = t.y,
                            t.y = e
                        }
                        ,
                        nodeUpdateTransform: ({x: t, y: e, height: a})=>`translate(${t},${e - a / 2})`
                    },
                    top: {
                        nodeLeftX: t=>-t.width / 2,
                        nodeRightX: t=>t.width / 2,
                        nodeTopY: t=>0,
                        nodeBottomY: t=>t.height,
                        nodeJoinX: t=>t.x - t.width / 2,
                        nodeJoinY: t=>t.y + t.height,
                        linkJoinX: t=>t.x,
                        linkJoinY: t=>t.y + t.height,
                        linkCompactXStart: t=>t.x + (t.compactEven ? t.width / 2 : -t.width / 2),
                        linkCompactYStart: t=>t.y + t.height / 2,
                        compactLinkMidX: (t,e)=>t.firstCompactNode.x + t.firstCompactNode.flexCompactDim[0] / 4 + e.compactMarginPair(t) / 4,
                        compactLinkMidY: t=>t.firstCompactNode.y,
                        compactDimension: {
                            sizeColumn: t=>t.width,
                            sizeRow: t=>t.height,
                            reverse: t=>t
                        },
                        linkX: t=>t.x,
                        linkY: t=>t.y,
                        linkParentX: t=>t.parent.x,
                        linkParentY: t=>t.parent.y + t.parent.height,
                        buttonX: t=>t.width / 2,
                        buttonY: t=>t.height,
                        centerTransform: ({rootMargin: t, scale: e, centerX: a})=>`translate(${a},${t}) scale(${e})`,
                        nodeFlexSize: ({height: t, width: e, siblingsMargin: a, childrenMargin: n, state: i, node: o})=>{
                            return i.compact && o.flexCompactDim ? [o.flexCompactDim[0], o.flexCompactDim[1]] : [e + a, t + n]
                        }
                        ,
                        zoomTransform: ({centerX: t, scale: e})=>`translate(${t},0}) scale(${e})`,
                        diagonal: this.diagonal.bind(this),
                        swap: t=>{}
                        ,
                        nodeUpdateTransform: ({x: t, y: e, width: a})=>`translate(${t - a / 2},${e})`
                    },
                    bottom: {
                        nodeLeftX: t=>-t.width / 2,
                        nodeRightX: t=>t.width / 2,
                        nodeTopY: t=>-t.height,
                        nodeBottomY: t=>0,
                        nodeJoinX: t=>t.x - t.width / 2,
                        nodeJoinY: t=>t.y - t.height - t.height,
                        linkJoinX: t=>t.x,
                        linkJoinY: t=>t.y - t.height,
                        linkCompactXStart: t=>t.x + (t.compactEven ? t.width / 2 : -t.width / 2),
                        linkCompactYStart: t=>t.y - t.height / 2,
                        compactLinkMidX: (t,e)=>t.firstCompactNode.x + t.firstCompactNode.flexCompactDim[0] / 4 + e.compactMarginPair(t) / 4,
                        compactLinkMidY: t=>t.firstCompactNode.y,
                        linkX: t=>t.x,
                        linkY: t=>t.y,
                        compactDimension: {
                            sizeColumn: t=>t.width,
                            sizeRow: t=>t.height,
                            reverse: t=>t
                        },
                        linkParentX: t=>t.parent.x,
                        linkParentY: t=>t.parent.y - t.parent.height,
                        buttonX: t=>t.width / 2,
                        buttonY: t=>0,
                        centerTransform: ({rootMargin: t, scale: e, centerX: a, chartHeight: n})=>`translate(${a},${n - t}) scale(${e})`,
                        nodeFlexSize: ({height: t, width: e, siblingsMargin: a, childrenMargin: n, state: i, node: o})=>{
                            return i.compact && o.flexCompactDim ? [o.flexCompactDim[0], o.flexCompactDim[1]] : [e + a, t + n]
                        }
                        ,
                        zoomTransform: ({centerX: t, scale: e})=>`translate(${t},0}) scale(${e})`,
                        diagonal: this.diagonal.bind(this),
                        swap: t=>{
                            t.y = -t.y
                        }
                        ,
                        nodeUpdateTransform: ({x: t, y: e, width: a, height: n})=>`translate(${t - a / 2},${e - n})`
                    },
                    right: {
                        nodeLeftX: t=>-t.width,
                        nodeRightX: t=>0,
                        nodeTopY: t=>-t.height / 2,
                        nodeBottomY: t=>t.height / 2,
                        nodeJoinX: t=>t.x - t.width - t.width,
                        nodeJoinY: t=>t.y - t.height / 2,
                        linkJoinX: t=>t.x - t.width,
                        linkJoinY: t=>t.y,
                        linkX: t=>t.x,
                        linkY: t=>t.y,
                        linkParentX: t=>t.parent.x - t.parent.width,
                        linkParentY: t=>t.parent.y,
                        buttonX: t=>0,
                        buttonY: t=>t.height / 2,
                        linkCompactXStart: t=>t.x - t.width / 2,
                        linkCompactYStart: t=>t.y + (t.compactEven ? t.height / 2 : -t.height / 2),
                        compactLinkMidX: (t,e)=>t.firstCompactNode.x,
                        compactLinkMidY: (t,e)=>t.firstCompactNode.y + t.firstCompactNode.flexCompactDim[0] / 4 + e.compactMarginPair(t) / 4,
                        centerTransform: ({rootMargin: t, centerY: e, scale: a, chartWidth: n})=>`translate(${n - t},${e}) scale(${a})`,
                        nodeFlexSize: ({height: t, width: e, siblingsMargin: a, childrenMargin: n, state: i, node: o})=>{
                            return i.compact && o.flexCompactDim ? [o.flexCompactDim[0], o.flexCompactDim[1]] : [t + a, e + n]
                        }
                        ,
                        compactDimension: {
                            sizeColumn: t=>t.height,
                            sizeRow: t=>t.width,
                            reverse: t=>t.slice().reverse()
                        },
                        zoomTransform: ({centerY: t, scale: e})=>`translate(0,${t}) scale(${e})`,
                        diagonal: this.hdiagonal.bind(this),
                        swap: t=>{
                            var e = t.x;
                            t.x = -t.y,
                            t.y = e
                        }
                        ,
                        nodeUpdateTransform: ({x: t, y: e, width: a, height: n})=>`translate(${t - a},${e - n / 2})`
                    }
                }
            };
            this.getChartState = ()=>a,
            Object.keys(a).forEach(e=>{
                this[e] = function(t) {
                    return arguments.length ? (a[e] = t,
                    this) : a[e]
                }
            }
            ),
            this.initializeEnterExitUpdatePattern()
        }
        initializeEnterExitUpdatePattern() {
            u.selection.prototype.patternify = function(t) {
                var e = t.selector
                  , a = t.tag
                  , t = t.data || [e]
                  , t = this.selectAll("." + e).data(t, (t,e)=>"object" == typeof t && t.id ? t.id : e);
                return t.exit().remove(),
                (t = t.enter().append(a).merge(t)).attr("class", e),
                t
            }
        }
        getNodeChildren({data: t, children: e, _children: a}, n) {
            return n.push(t),
            e && e.forEach(t=>{
                this.getNodeChildren(t, n)
            }
            ),
            a && a.forEach(t=>{
                this.getNodeChildren(t, n)
            }
            ),
            n
        }
        initialZoom(t) {
            return this.getChartState().lastTransform.k = t,
            this
        }
        render() {
            const o = this.getChartState();
            if (o.data && 0 != o.data.length) {
                var t = u.select(o.container)
                  , e = t.node().getBoundingClientRect();
                0 < e.width && (o.svgWidth = e.width);
                const a = {
                    id: "ID" + Math.floor(1e6 * Math.random()),
                    chartWidth: o.svgWidth,
                    chartHeight: o.svgHeight
                };
                (o.calc = a).centerX = a.chartWidth / 2,
                a.centerY = a.chartHeight / 2,
                o.firstDraw && ((e = {
                    zoom: null
                }).zoom = u.zoom().on("start", (t,e)=>o.onZoomStart(t, e)).on("end", (t,e)=>o.onZoomEnd(t, e)).on("zoom", (t,e)=>{
                    o.onZoom(t, e),
                    this.zoomed(t, e)
                }
                ).scaleExtent(o.scaleExtent),
                o.zoomBehavior = e.zoom),
                o.flexTreeLayout = r.flextree({
                    nodeSize: t=>{
                        var e = o.nodeWidth(t)
                          , a = o.nodeHeight(t)
                          , n = o.siblingsMargin(t)
                          , i = o.childrenMargin(t);
                        return o.layoutBindings[o.layout].nodeFlexSize({
                            state: o,
                            node: t,
                            width: e,
                            height: a,
                            siblingsMargin: n,
                            childrenMargin: i
                        })
                    }
                }).spacing((t,e)=>t.parent == e.parent ? 0 : o.neighbourMargin(t, e)),
                this.setLayouts({
                    expandNodesFirst: !1
                });
                e = t.patternify({
                    tag: "svg",
                    selector: "svg-chart-container"
                }).attr("width", o.svgWidth).attr("height", o.svgHeight).attr("font-family", o.defaultFont),
                t = (o.firstDraw && e.call(o.zoomBehavior).on("dblclick.zoom", null).attr("cursor", "move"),
                (o.svg = e).patternify({
                    tag: "g",
                    selector: "chart"
                }));
                o.centerG = t.patternify({
                    tag: "g",
                    selector: "center-group"
                }),
                o.linksWrapper = o.centerG.patternify({
                    tag: "g",
                    selector: "links-wrapper"
                }),
                o.nodesWrapper = o.centerG.patternify({
                    tag: "g",
                    selector: "nodes-wrapper"
                }),
                o.connectionsWrapper = o.centerG.patternify({
                    tag: "g",
                    selector: "connections-wrapper"
                }),
                o.defsWrapper = e.patternify({
                    tag: "g",
                    selector: "defs-wrapper"
                }),
                o.firstDraw && o.centerG.attr("transform", ()=>o.layoutBindings[o.layout].centerTransform({
                    centerX: a.centerX,
                    centerY: a.centerY,
                    scale: o.lastTransform.k,
                    rootMargin: o.rootMargin,
                    root: o.root,
                    chartHeight: a.chartHeight,
                    chartWidth: a.chartWidth
                })),
                o.chart = t,
                this.update(o.root),
                u.select(window).on("resize." + o.id, ()=>{
                    var t = u.select(o.container).node().getBoundingClientRect();
                    o.svg.attr("width", t.width)
                }
                ),
                o.firstDraw && (o.firstDraw = !1)
            } else
                console.log("ORG CHART - Data is empty");
            return this
        }
        addNode(e) {
            const a = this.getChartState();
            var t = a.allNodes.filter(({data: t})=>a.nodeId(t) === a.nodeId(e))[0]
              , n = a.allNodes.filter(({data: t})=>a.nodeId(t) === a.parentNodeId(e))[0];
            return t ? console.log(`ORG CHART - ADD - Node with id "${a.nodeId(e)}" already exists in tree`) : n ? (e._centered && !e._expanded && (e._expanded = !0),
            a.data.push(e),
            this.updateNodesState()) : console.log(`ORG CHART - ADD - Parent node with id "${a.parentNodeId(e)}" not found in the tree`),
            this
        }
        updateNode(e){
            const a = this.getChartState();
            a.data.forEach((t, index) => {
                if(t.id == e.id) {
                    a.data[index] = {...e, _expanded: true};
                }
            })
            this.updateNodesState();

        }
        removeNode(e) {
            const a = this.getChartState();
            var t = a.allNodes.filter(({data: t})=>a.nodeId(t) == e)[0];
            return t ? (t.descendants().forEach(t=>t.data._filteredOut = !0),
            this.getNodeChildren(t, [], a.nodeId).forEach(t=>t._filtered = !0),
            a.data = a.data.filter(t=>!t._filtered),
            this.updateNodesState.bind(this)()) : console.log(`ORG CHART - REMOVE - Node with id "${e}" not found in the tree`),
            this
        }
        groupBy(t, a, e) {
            const n = {};
            return t.forEach(t=>{
                var e = a(t);
                n[e] || (n[e] = []),
                n[e].push(t)
            }
            ),
            Object.keys(n).forEach(t=>{
                n[t] = e(n[t])
            }
            ),
            Object.entries(n)
        }
        calculateCompactFlexDimensions(t) {
            const r = this.getChartState();
            t.eachBefore(t=>{
                t.firstCompact = null,
                t.compactEven = null,
                t.flexCompactDim = null,
                t.firstCompactNode = null
            }
            ),
            t.eachBefore(t=>{
                if (t.children && 1 < t.children.length) {
                    const n = t.children.filter(t=>!t.children);
                    if (!(n.length < 2)) {
                        n.forEach((t,e)=>{
                            e || (t.firstCompact = !0),
                            t.compactEven = !(e % 2),
                            t.row = Math.floor(e / 2)
                        }
                        );
                        var e = u.max(n.filter(t=>t.compactEven), r.layoutBindings[r.layout].compactDimension.sizeColumn)
                          , a = u.max(n.filter(t=>!t.compactEven), r.layoutBindings[r.layout].compactDimension.sizeColumn);
                        const i = 2 * Math.max(e, a);
                        e = this.groupBy(n, t=>t.row, t=>u.max(t, t=>r.layoutBindings[r.layout].compactDimension.sizeRow(t) + r.compactMarginBetween(t)));
                        const o = u.sum(e.map(t=>t[1]));
                        n.forEach(t=>{
                            t.firstCompactNode = n[0],
                            t.firstCompact ? t.flexCompactDim = [i + r.compactMarginPair(t), o - r.compactMarginBetween(t)] : t.flexCompactDim = [0, 0]
                        }
                        ),
                        t.flexCompactDim = null
                    }
                }
            }
            )
        }
        calculateCompactFlexPositions(t) {
            const r = this.getChartState();
            t.eachBefore(t=>{
                if (t.children) {
                    var e = t.children.filter(t=>t.flexCompactDim);
                    const n = e[0];
                    if (n) {
                        e.forEach((t,e,a)=>{
                            0 == e && (n.x -= n.flexCompactDim[0] / 2),
                            e & e % 2 - 1 ? t.x = n.x + .25 * n.flexCompactDim[0] - r.compactMarginPair(t) / 4 : e && (t.x = n.x + .75 * n.flexCompactDim[0] + r.compactMarginPair(t) / 4)
                        }
                        );
                        var a = n.x + .5 * n.flexCompactDim[0];
                        n.x = n.x + .25 * n.flexCompactDim[0] - r.compactMarginPair(n) / 4;
                        const i = t.x - a;
                        Math.abs(i) < 10 && e.forEach(t=>t.x += i);
                        t = this.groupBy(e, t=>t.row, t=>u.max(t, t=>r.layoutBindings[r.layout].compactDimension.sizeRow(t)));
                        const o = u.cumsum(t.map(t=>t[1] + r.compactMarginBetween(t)));
                        e.forEach((t,e)=>{
                            t.row ? t.y = n.y + o[t.row - 1] : t.y = n.y
                        }
                        )
                    }
                }
            }
            )
        }
        update({x0: a, y0: n, x: i=0, y: o=0, width: r, height: d}) {
            const s = this.getChartState();
            s.calc;
            s.compact;
            var t = s.flexTreeLayout(s.root)
              , e = (s.compact && this.calculateCompactFlexPositions(s.root),
            t.descendants())
              , t = t.descendants().slice(1)
              , l = (e.forEach(s.layoutBindings[s.layout].swap),
            s.connections);
            const h = {}
              , c = (s.allNodes.forEach(t=>h[s.nodeId(t.data)] = t),
            {});
            e.forEach(t=>c[s.nodeId(t.data)] = t),
            l.forEach(t=>{
                var e = h[t.from]
                  , a = h[t.to];
                t._source = e,
                t._target = a
            }
            );
            var l = l.filter(t=>c[t.from] && c[t.to])
              , g = s.defs.bind(this)(s, l)
              , g = (g !== s.defsWrapper.html() && s.defsWrapper.html(g),
            s.linksWrapper.selectAll("path.link").data(t, t=>s.nodeId(t.data)))
              , t = g.enter().insert("path", "g").attr("class", "link").attr("d", t=>{
                var e = {
                    x: s.layoutBindings[s.layout].linkJoinX({
                        x: a,
                        y: n,
                        width: r,
                        height: d
                    }),
                    y: s.layoutBindings[s.layout].linkJoinY({
                        x: a,
                        y: n,
                        width: r,
                        height: d
                    })
                };
                return s.layoutBindings[s.layout].diagonal(e, e, e)
            }
            ).merge(g)
              , t = (t.attr("fill", "none"),
            this.isEdge() ? t.style("display", t=>{
                return t.data._pagingButton ? "none" : "auto"
            }
            ) : t.attr("display", t=>{
                return t.data._pagingButton ? "none" : "auto"
            }
            ),
            t.each(s.linkUpdate),
            t.transition().duration(s.duration).attr("d", t=>{
                var e = s.compact && t.flexCompactDim ? {
                    x: s.layoutBindings[s.layout].compactLinkMidX(t, s),
                    y: s.layoutBindings[s.layout].compactLinkMidY(t, s)
                } : {
                    x: s.layoutBindings[s.layout].linkX(t),
                    y: s.layoutBindings[s.layout].linkY(t)
                }
                  , a = {
                    x: s.layoutBindings[s.layout].linkParentX(t),
                    y: s.layoutBindings[s.layout].linkParentY(t)
                }
                  , t = s.compact && t.flexCompactDim ? {
                    x: s.layoutBindings[s.layout].linkCompactXStart(t),
                    y: s.layoutBindings[s.layout].linkCompactYStart(t)
                } : e;
                return s.layoutBindings[s.layout].diagonal(e, a, t, {
                    sy: s.linkYOffset
                })
            }
            ),
            g.exit().transition().duration(s.duration).attr("d", t=>{
                var e = {
                    x: s.layoutBindings[s.layout].linkJoinX({
                        x: i,
                        y: o,
                        width: r,
                        height: d
                    }),
                    y: s.layoutBindings[s.layout].linkJoinY({
                        x: i,
                        y: o,
                        width: r,
                        height: d
                    })
                };
                return s.layoutBindings[s.layout].diagonal(e, e, null, {
                    sy: s.linkYOffset
                })
            }
            ).remove(),
            s.connectionsWrapper.selectAll("path.connection").data(l))
              , g = t.enter().insert("path", "g").attr("class", "connection").attr("d", t=>{
                var e = {
                    x: s.layoutBindings[s.layout].linkJoinX({
                        x: a,
                        y: n,
                        width: r,
                        height: d
                    }),
                    y: s.layoutBindings[s.layout].linkJoinY({
                        x: a,
                        y: n,
                        width: r,
                        height: d
                    })
                };
                return s.layoutBindings[s.layout].diagonal(e, e, null, {
                    sy: s.linkYOffset
                })
            }
            ).merge(t)
              , l = (g.attr("fill", "none"),
            g.transition().duration(s.duration).attr("d", t=>{
                var e = s.layoutBindings[s.layout].linkX({
                    x: t._source.x,
                    y: t._source.y,
                    width: t._source.width,
                    height: t._source.height
                })
                  , a = s.layoutBindings[s.layout].linkY({
                    x: t._source.x,
                    y: t._source.y,
                    width: t._source.width,
                    height: t._source.height
                })
                  , n = s.layoutBindings[s.layout].linkJoinX({
                    x: t._target.x,
                    y: t._target.y,
                    width: t._target.width,
                    height: t._target.height
                })
                  , t = s.layoutBindings[s.layout].linkJoinY({
                    x: t._target.x,
                    y: t._target.y,
                    width: t._target.width,
                    height: t._target.height
                });
                return s.linkGroupArc({
                    source: {
                        x: e,
                        y: a
                    },
                    target: {
                        x: n,
                        y: t
                    }
                })
            }
            ),
            g.each(s.connectionsUpdate),
            t.exit().transition().duration(s.duration).attr("opacity", 0).remove(),
            s.nodesWrapper.selectAll("g.node").data(e, ({data: t})=>s.nodeId(t)))
              , g = l.enter().append("g").attr("class", "node").attr("transform", t=>{
                return t == s.root ? `translate(${a},${n})` : `translate(${s.layoutBindings[s.layout].nodeJoinX({
                    x: a,
                    y: n,
                    width: r,
                    height: d
                })},${s.layoutBindings[s.layout].nodeJoinY({
                    x: a,
                    y: n,
                    width: r,
                    height: d
                })})`
            }
            ).attr("cursor", "pointer").on("click", (t,e)=>{
                var a = e["data"];
                [...t.srcElement.classList].includes("node-button-foreign-object") || ([...t.srcElement.classList].includes("paging-button-wrapper") ? this.loadPagingNodes(e) : a._pagingButton ? console.log("event fired, no handlers") : (s.onNodeClick(a),
                console.log("node clicked")))
            }
            )
              , t = (g.patternify({
                tag: "rect",
                selector: "node-rect",
                data: t=>[t]
            }),
            g.merge(l).style("font", "12px sans-serif"))
              , g = (t.patternify({
                tag: "foreignObject",
                selector: "node-foreign-object",
                data: t=>[t]
            }).style("overflow", "visible").patternify({
                tag: "xhtml:div",
                selector: "node-foreign-object-div",
                data: t=>[t]
            }),
            this.restyleForeignObjectElements(),
            g.patternify({
                tag: "g",
                selector: "node-button-g",
                data: t=>[t]
            }).on("click", (t,e)=>this.onButtonClick(t, e)))
              , g = (g.patternify({
                tag: "rect",
                selector: "node-button-rect",
                data: t=>[t]
            }).attr("opacity", 0).attr("pointer-events", "all").attr("width", t=>s.nodeButtonWidth(t)).attr("height", t=>s.nodeButtonHeight(t)).attr("x", t=>s.nodeButtonX(t)).attr("y", t=>s.nodeButtonY(t)),
            g.patternify({
                tag: "foreignObject",
                selector: "node-button-foreign-object",
                data: t=>[t]
            }).attr("width", t=>s.nodeButtonWidth(t)).attr("height", t=>s.nodeButtonHeight(t)).attr("x", t=>s.nodeButtonX(t)).attr("y", t=>s.nodeButtonY(t)).style("overflow", "visible").patternify({
                tag: "xhtml:div",
                selector: "node-button-div",
                data: t=>[t]
            }).style("pointer-events", "none").style("display", "flex").style("width", "100%").style("height", "100%"),
            t.transition().attr("opacity", 0).duration(s.duration).attr("transform", ({x: t, y: e, width: a, height: n})=>s.layoutBindings[s.layout].nodeUpdateTransform({
                x: t,
                y: e,
                width: a,
                height: n
            })).attr("opacity", 1),
            t.select(".node-rect").attr("width", ({width: t})=>t).attr("height", ({height: t})=>t).attr("x", ({})=>0).attr("y", ({})=>0).attr("cursor", "pointer").attr("rx", 3).attr("fill", s.nodeDefaultBackground),
            t.select(".node-button-g").attr("transform", ({width: t, height: e})=>{
                return `translate(${s.layoutBindings[s.layout].buttonX({
                    width: t,
                    height: e
                })},${s.layoutBindings[s.layout].buttonY({
                    width: t,
                    height: e
                })})`
            }
            ).attr("display", ({data: t})=>0 < t._directSubordinates ? null : "none").attr("opacity", ({data: t, children: e, _children: a})=>!t._pagingButton && (e || a) ? 1 : 0),
            t.select(".node-button-foreign-object .node-button-div").html(t=>s.buttonContent({
                node: t,
                state: s
            })),
            t.select(".node-button-text").attr("text-anchor", "middle").attr("alignment-baseline", "middle").attr("font-size", ({children: t})=>t ? 40 : 26).text(({children: t})=>t ? "-" : "+").attr("y", this.isEdge() ? 10 : 0),
            t.each(s.nodeUpdate),
            l.exit().attr("opacity", 1).transition().duration(s.duration).attr("transform", t=>{
                return `translate(${s.layoutBindings[s.layout].nodeJoinX({
                    x: i,
                    y: o,
                    width: r,
                    height: d
                })},${s.layoutBindings[s.layout].nodeJoinY({
                    x: i,
                    y: o,
                    width: r,
                    height: d
                })})`
            }
            ).on("end", function() {
                u.select(this).remove()
            }).attr("opacity", 0),
            e.forEach(t=>{
                t.x0 = t.x,
                t.y0 = t.y
            }
            ),
            s.allNodes.filter(t=>t.data._centered)[0]);
            if (g) {
                let t = [g];
                g.data._centeredWithDescendants && (t = s.compact ? g.descendants().filter((t,e)=>e < 7) : g.descendants().filter((t,e,a)=>{
                    var n = Math.round(a.length / 2);
                    return a.length % 2 ? n - 2 < e && e < n + 2 - 1 : n - 2 < e && e < n + 2
                }
                )),
                g.data._centeredWithDescendants = null,
                g.data._centered = null,
                this.fit({
                    animate: !0,
                    scale: !1,
                    nodes: t
                })
            }
        }
        isEdge() {
            return window.navigator.userAgent.includes("Edge")
        }
        hdiagonal(t, e, a, n) {
            return this.getChartState().hdiagonal(t, e, a, n)
        }
        diagonal(t, e, a, n) {
            return this.getChartState().diagonal(t, e, a, n)
        }
        restyleForeignObjectElements() {
            const n = this.getChartState();
            n.svg.selectAll(".node-foreign-object").attr("width", ({width: t})=>t).attr("height", ({height: t})=>t).attr("x", ({})=>0).attr("y", ({})=>0),
            n.svg.selectAll(".node-foreign-object-div").style("width", ({width: t})=>t + "px").style("height", ({height: t})=>t + "px").html(function(t, e, a) {
                return t.data._pagingButton ? `<div class="paging-button-wrapper"><div style="pointer-events:none">${n.pagingButton(t, e, a, n)}</div></div>` : n.nodeContent.bind(this)(t, e, a, n)
            })
        }
        onButtonClick(t, e) {
            var a = this.getChartState();
            e.data._pagingButton || (a.setActiveNodeCentered && (e.data._centered = !0,
            e.data._centeredWithDescendants = !0),
            e.children ? (e._children = e.children,
            e.children = null,
            this.setExpansionFlagToChildren(e, !1)) : (e.children = e._children,
            e._children = null,
            e.children && e.children.forEach(({data: t})=>t._expanded = !0)),
            this.update(e))
        }
        setExpansionFlagToChildren({data: t, children: e, _children: a}, n) {
            t._expanded = n,
            e && e.forEach(t=>{
                this.setExpansionFlagToChildren(t, n)
            }
            ),
            a && a.forEach(t=>{
                this.setExpansionFlagToChildren(t, n)
            }
            )
        }
        expandSomeNodes(e) {
            if (e.data._expanded) {
                let t = e.parent;
                for (; t; )
                    t._children && (t.children = t._children),
                    t = t.parent
            }
            e._children && e._children.forEach(t=>this.expandSomeNodes(t)),
            e.children && e.children.forEach(t=>this.expandSomeNodes(t))
        }
        updateNodesState() {
            var t = this.getChartState();
            this.setLayouts({
                expandNodesFirst: !0
            }),
            this.update(t.root)
        }
        setLayouts({expandNodesFirst: t=!0}) {
            const o = this.getChartState()
              , n = (o.root = u.stratify().id(t=>o.nodeId(t)).parentId(t=>o.parentNodeId(t))(o.data),
            {});
            o.root.descendants().filter(t=>t.children).filter(t=>!t.data._pagingStep).forEach(t=>{
                t.data._pagingStep = o.minPagingVisibleNodes(t)
            }
            ),
            o.root.eachBefore((a,t)=>{
                a.data._directSubordinatesPaging = a.children ? a.children.length : 0,
                a.children && a.children.forEach((t,e)=>{
                    t.data._pagingButton = !1,
                    e > a.data._pagingStep && (n[t.id] = !0),
                    e === a.data._pagingStep && a.children.length - 1 > a.data._pagingStep && (t.data._pagingButton = !0),
                    n[t.parent.id] && (n[t.id] = !0)
                }
                )
            }
            ),
            o.root = u.stratify().id(t=>o.nodeId(t)).parentId(t=>o.parentNodeId(t))(o.data.filter(t=>!0 !== n[t.id])),
            o.root.each((t,e,a)=>{
                var n = o.nodeWidth(t)
                  , i = o.nodeHeight(t);
                Object.assign(t, {
                    width: n,
                    height: i
                })
            }
            ),
            o.root.x0 = 0,
            o.root.y0 = 0,
            o.allNodes = o.root.descendants(),
            o.allNodes.forEach(t=>{
                Object.assign(t.data, {
                    _directSubordinates: t.children ? t.children.length : 0,
                    _totalSubordinates: t.descendants().length - 1
                })
            }
            ),
            o.root.children && (t && o.root.children.forEach(this.expand),
            o.root.children.forEach(t=>this.collapse(t)),
            0 == o.expandLevel && (o.root._children = o.root.children,
            o.root.children = null),
            [o.root].forEach(t=>this.expandSomeNodes(t)))
        }
        collapse(t) {
            t.children && (t._children = t.children,
            t._children.forEach(t=>this.collapse(t)),
            t.children = null)
        }
        expand(t) {
            t._children && (t.children = t._children,
            t.children.forEach(t=>this.expand(t)),
            t._children = null)
        }
        zoomed(t, e) {
            var a = this.getChartState()
              , n = a.chart
              , t = t.transform;
            a.lastTransform = t,
            n.attr("transform", t),
            this.isEdge() && this.restyleForeignObjectElements()
        }
        zoomTreeBounds({x0: t, x1: e, y0: a, y1: n, params: i={
            animate: !0,
            scale: !0
        }}) {
            var {centerG: o, svgWidth: r, svgHeight: d, svg: s, zoomBehavior: l, duration: h, lastTransform: c} = this.getChartState()
              , g = Math.min(8, .9 / Math.max((e - t) / r, (n - a) / d));
            let p = u.zoomIdentity.translate(r / 2, d / 2);
            p = (p = p.scale(i.scale ? g : c.k)).translate(-(t + e) / 2, -(a + n) / 2),
            s.transition().duration(i.animate ? h : 0).call(l.transform, p),
            o.transition().duration(i.animate ? h : 0).attr("transform", "translate(0,0)")
        }
        fit({animate: t=!0, nodes: e, scale: a=!0}={}) {
            const n = this.getChartState();
            var i = n["root"]
              , e = e || i.descendants()
              , i = u.min(e, t=>t.x + n.layoutBindings[n.layout].nodeLeftX(t))
              , o = u.max(e, t=>t.x + n.layoutBindings[n.layout].nodeRightX(t))
              , r = u.min(e, t=>t.y + n.layoutBindings[n.layout].nodeTopY(t))
              , e = u.max(e, t=>t.y + n.layoutBindings[n.layout].nodeBottomY(t));
            return this.zoomTreeBounds({
                params: {
                    animate: t,
                    scale: a
                },
                x0: i - 50,
                x1: o + 50,
                y0: r - 50,
                y1: e + 50
            }),
            this
        }
        loadPagingNodes(t) {
            var e = this.getChartState()
              , a = (t.data._pagingButton = !1,
            t.parent.data._pagingStep)
              , e = e.pagingStep(t.parent);
            t.parent.data._pagingStep = a + e,
            console.log("loading paging nodes", t),
            this.updateNodesState()
        }
        setExpanded(e, t=!0) {
            const a = this.getChartState();
            var n = a.allNodes.filter(({data: t})=>a.nodeId(t) == e)[0];
            return n ? n.data._expanded = t : console.log(`ORG CHART - ${t ? "EXPAND" : "COLLAPSE"} - Node with id (${e})  not found in the tree`),
            this
        }
        setCentered(e) {
            const a = this.getChartState();
            var t = a.allNodes.filter(t=>a.nodeId(t.data) === e)[0];
            return t ? (t.data._centered = !0,
            t.data._expanded = !0) : console.log(`ORG CHART - CENTER - Node with id (${e}) not found in the tree`),
            this
        }
        setHighlighted(e) {
            const a = this.getChartState();
            var t = a.allNodes.filter(t=>a.nodeId(t.data) === e)[0];
            return t ? (t.data._highlighted = !0,
            t.data._expanded = !0,
            t.data._centered = !0) : console.log(`ORG CHART - HIGHLIGHT - Node with id (${e})  not found in the tree`),
            this
        }
        setUpToTheRootHighlighted(e) {
            const a = this.getChartState();
            var t = a.allNodes.filter(t=>a.nodeId(t.data) === e)[0];
            return t ? (t.data._upToTheRootHighlighted = !0,
            t.data._expanded = !0,
            t.ancestors().forEach(t=>t.data._upToTheRootHighlighted = !0)) : console.log(`ORG CHART - HIGHLIGHTROOT - Node with id (${e}) not found in the tree`),
            this
        }
        clearHighlighting() {
            var t = this.getChartState();
            t.allNodes.forEach(t=>{
                t.data._highlighted = !1,
                t.data._upToTheRootHighlighted = !1
            }
            ),
            this.update(t.root)
        }
        fullscreen(t) {
            const e = this.getChartState()
              , a = u.select(t || e.container).node();
            u.select(document).on("fullscreenchange." + e.id, function(t) {
                (document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement) == a ? setTimeout(t=>{
                    e.svg.attr("height", window.innerHeight - 40)
                }
                , 500) : e.svg.attr("height", e.svgHeight)
            }),
            a.requestFullscreen ? a.requestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen ? a.webkitRequestFullscreen() : a.msRequestFullscreen && a.msRequestFullscreen()
        }
        zoomIn() {
            var {svg: t, zoomBehavior: e} = this.getChartState();
            t.transition().call(e.scaleBy, 1.3)
        }
        zoomOut() {
            var {svg: t, zoomBehavior: e} = this.getChartState();
            t.transition().call(e.scaleBy, .78)
        }
        toDataURL(t, e) {
            var a = new XMLHttpRequest;
            a.onload = function() {
                var t = new FileReader;
                t.onloadend = function() {
                    e(t.result)
                }
                ,
                t.readAsDataURL(a.response)
            }
            ,
            a.open("GET", t),
            a.responseType = "blob",
            a.send()
        }
        exportImg({full: a=!1, scale: n=3, onLoad: i=t=>t, save: o=!0}={}) {
            const r = this
              , d = this.getChartState()
              , {svg: t, root: s} = d;
            let e = 0;
            var l = t.selectAll("img");
            let h = l.size();
            const c = ()=>{
                JSON.parse(JSON.stringify(r.lastTransform()));
                var t = r.duration();
                a && r.fit();
                const e = r.getChartState()["svg"];
                setTimeout(t=>{
                    r.downloadImage({
                        node: e.node(),
                        scale: n,
                        isSvg: !1,
                        onAlreadySerialized: t=>{
                            r.update(s)
                        }
                        ,
                        imageName: d.imageName,
                        onLoad: i,
                        save: o
                    })
                }
                , a ? t + 10 : 0)
            }
            ;
            0 < h ? l.each(function() {
                r.toDataURL(this.src, t=>{
                    this.src = t,
                    ++e == h && c()
                }
                )
            }) : c()
        }
        exportSvg() {
            var {svg: t, imageName: e} = this.getChartState();
            return this.downloadImage({
                imageName: e,
                node: t.node(),
                scale: 3,
                isSvg: !0
            }),
            this
        }
        expandAll() {
            var t = this.getChartState()["allNodes"];
            return t.forEach(t=>t.data._expanded = !0),
            this.render(),
            this
        }
        collapseAll() {
            var t = this.getChartState()["allNodes"];
            return t.forEach(t=>t.data._expanded = !1),
            this.expandLevel(0),
            this.render(),
            this
        }
        downloadImage({node: t, scale: e=2, imageName: n="graph", isSvg: a=!1, save: i=!0, onAlreadySerialized: o=t=>{}
        , onLoad: r=t=>{}
        }) {
            const d = t;
            if (a)
                t = '<?xml version="1.0" standalone="no"?>\r\n' + (t = h(d)),
                l(s = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(t), n + ".svg"),
                o();
            else {
                const c = e
                  , g = document.createElement("img");
                g.onload = function() {
                    var t = document.createElement("canvas")
                      , e = d.getBoundingClientRect()
                      , a = (t.width = e.width * c,
                    t.height = e.height * c,
                    t.getContext("2d"))
                      , a = (a.fillStyle = "#FAFAFA",
                    a.fillRect(0, 0, e.width * c, e.height * c),
                    a.drawImage(g, 0, 0, e.width * c, e.height * c),
                    t.toDataURL("image/png"));
                    r && r(a),
                    i && l(a, n + ".png")
                }
                ;
                var s = "data:image/svg+xml; charset=utf8, " + encodeURIComponent(h(d));
                function l(t, e) {
                    var a = document.createElement("a");
                    "string" == typeof a.download ? (document.body.appendChild(a),
                    a.download = e,
                    a.href = t,
                    a.click(),
                    document.body.removeChild(a)) : location.replace(t)
                }
                function h(t) {
                    for (var e = "http://www.w3.org/2000/xmlns/", a = (t = t.cloneNode(!0),
                    window.location.href + "#"), n = document.createTreeWalker(t, NodeFilter.SHOW_ELEMENT, null, !1); n.nextNode(); )
                        for (const i of n.currentNode.attributes)
                            i.value.includes(a) && (i.value = i.value.replace(a, "#"));
                    return t.setAttributeNS(e, "xmlns", "http://www.w3.org/2000/svg"),
                    t.setAttributeNS(e, "xmlns:xlink", "http://www.w3.org/1999/xlink"),
                    (new XMLSerializer).serializeToString(t)
                }
                o(),
                g.src = s
            }
        }
        getTextWidth(t, {fontSize: e=14, fontWeight: a=400, defaultFont: n="Helvetice", ctx: i}={}) {
            return i.font = `${a || ""} ${e}px ${n} `,
            i.measureText(t).width
        }
    }
    ,
    Object.defineProperty(t, "__esModule", {
        value: !0
    })
});
