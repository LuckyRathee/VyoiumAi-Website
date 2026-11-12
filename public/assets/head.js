function createHeadPoints(small) {
 const points=[];let seed=47;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const gauss=(v,c,w)=>Math.exp(-Math.pow((v-c)/w,2));
 const width=y=>Math.sqrt(Math.max(0,1-y*y))*(y<-.25?.59+.15*(y+.25):.65);
 const depth=(x,y)=>{
  const w=width(y);const front=Math.sqrt(Math.max(0,1-(x/w)**2))*.47;
  const nose=.24*gauss(x,0,.065)*gauss(y,-.06,.29)+.14*gauss(x,0,.10)*gauss(y,-.23,.075);
  const sockets=-.10*(gauss(x,.23,.13)+gauss(x,-.23,.13))*gauss(y,.16,.095);
  const brows=.055*(gauss(x,.24,.17)+gauss(x,-.24,.17))*gauss(y,.29,.05);
  const cheeks=.08*(gauss(x,.36,.12)+gauss(x,-.36,.12))*gauss(y,-.10,.16);
  const mouth=-.035*gauss(x,0,.21)*gauss(y,-.43,.035)+.05*gauss(x,0,.20)*gauss(y,-.47,.065);
  const chin=.055*gauss(x,0,.23)*gauss(y,-.69,.16);
  return front+nose+sockets+brows+cheeks+mouth+chin;
 };
 const add=(x,y,z,feature='',size)=>points.push({x,y,z,feature,color:feature==='eyes'||feature==='lips'?'#f4ede8':random()<.24?'#ff2dab':'#bdb9b5',size:size||(.5+random()*.7)});
 const rows=small?65:104,cols=small?65:104;
 for(let j=0;j<rows;j++){const y=-.96+j/(rows-1)*1.94;const w=width(y);for(let i=0;i<cols;i++){const x=-w+i/(cols-1)*2*w;if(random()<.12)continue;const eye=(Math.abs(x-.23)<.11||Math.abs(x+.23)<.11)&&Math.abs(y-.16)<.048; if(eye&&random()<.83)continue;const xx=x+(random()-.5)*.006,yy=y+(random()-.5)*.006;add(xx,yy,depth(xx,yy));}}
 // Sparse back of skull preserves a three-dimensional silhouette without washing out the face.
 for(let i=0;i<(small?350:900);i++){const y=-.92+random()*1.9;const phi=Math.PI+random()*Math.PI;const x=width(y)*Math.cos(phi);add(x,y,-Math.sqrt(Math.max(0,1-y*y))*.44*Math.abs(Math.sin(phi)),'back',.55);}
 const contour=(feature,fn,n=180)=>{for(let i=0;i<n;i++){const [x,y]=fn(i/(n-1));add(x,y,depth(x,y)+.012,feature,.8+random()*.35);}};
 for(const side of [-1,1]){
  contour('eyes',t=>{const a=t*Math.PI*2;return [side*.23+Math.cos(a)*.112,.16+Math.sin(a)*.044];});
  contour('brows',t=>[side*(.105+t*.245),.27+Math.sin(t*Math.PI)*.025],100);
  contour('nose',t=>[side*(.035+.065*Math.pow(t,3)),.23-t*.50],110);
  contour('nose',t=>[side*(.04+t*.09),-.26-Math.sin(t*Math.PI)*.035],80);
  contour('jaw',t=>{const y=.27-t*1.17;return [side*width(y)*.97,y];},200);
 }
 contour('lips',t=>{const x=(t-.5)*.38;return [x,-.425+Math.abs(x)*.14-.018*gauss(x,0,.04)];});
 contour('lips',t=>{const x=(t-.5)*.38;return [x,-.445-.036*Math.sin(t*Math.PI)];});
 contour('jaw',t=>[(t-.5)*.37,-.82-.06*Math.sin(t*Math.PI)],100);
 return points;
}
