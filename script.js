// -----------------------------------creando variables------------------------------------------------

let movieDataUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let movieData;

let canvas = d3.select('#canvas')

let tooltip = d3.select('#tooltip')

let drawTreeMap = () =>{

  // Lo primero que debemos hacer es asignar una jerarquia, para decirle a d3 cual de los nodos debe considerar hijos de un elemento. En este caso, la data indica los hijos como 'children'. Luego, el metodo sum lo utilizamos ya que nos servirá para darle mayor area en la pantalla a la categoria de peliculas que tenga un mayor valor, mayor recaudacion de dinero. Finalmente, el método sort servirá para filtrar cada pelicula por la que tenga mayor valor; colocando la de mayor valor primero,ya que este mtodo devuelve un numero.
  let hierarchy = d3.hierarchy(movieData, 
    (node) => {
        return node['children']
    }
).sum(
    (node) => {
        return node['value']
    }
).sort(
    (node1, node2) => {
        return node2['value'] - node1['value']
    } 
)

  // Acá creamos la funcion para dibujar el treeemap. el metodo size se refiere al espacio disponible en nuestro svg para dinujar nuestro treemap; en este caso, como en nuestro css configuramos nuestro svg con un ancho de 1000 px y una altura de 600 px, esos seran los valores que estaremos utilizando
  let createTreeMap = d3.treemap()
                        .size([1000,600])

  // Este método (d3.treemap) acepta una jerarquía, asigna un are dependiendo de la magnitud de los parametros seleccionados
  createTreeMap(hierarchy)
  // el metodo .leaves() filtra y muestra los ultimos hijos; los elementos que ya no tienen lmas hijos.
  let movieTiles = hierarchy.leaves() 
  console.log(movieTiles)

  // Para crear los rectangulos, debemos crear grupos de elementos (g)
    let block = canvas.selectAll('g')
                  // vinculamos los elementos g a nuestros datos
                  .data(movieTiles)
                  .enter()
                  // anexamos un elemento g a cada valor
                  .append('g')
                //   Acá asiganmos un valor para cada ectangulo, para cada condenada (x,y)
                .attr('transform', (movie)=>{
                    return 'translate('+ movie['x0'] + ', '+ movie['y0']+')'
                })
                  
    block.append('rect')
         .attr('class', 'tile')
         .attr('fill', (movie)=>{
            let category = movie['data']['category'];
            if (category === 'Action'){
                return 'orange'
            } else if (category === 'Drama'){
                return 'lightgreen'
            } else if(category === 'Adventure'){
                return 'coral'
            } else if(category === 'Family'){
                return 'lightblue'
            } else if(category==='Animation'){
                return 'pink'
            } else if(category === 'Comedy'){
                return 'khaki'
            } else if(category === 'Biography'){
                return 'tan'
            }
         })
         .attr('data-name', (movie)=>{
            return movie['data']['name']
         })
         .attr('data-category', (movie)=>{
            return movie['data']['category']
         })
         .attr('data-value', (movie)=>{
            return movie['data']['value']
         })
         .attr('width', (movie)=>{
            return movie['x1'] - movie['x0']
         })
         .attr('height', (movie)=>{
            return movie['y1'] - movie['y0']
         })
         .on('mouseover', (movie) => {
            tooltip.transition()
                    .style('visibility', 'visible')
        
            let movieData = movie['data']
        
            tooltip.text(
                movieData['name'] + ' : $' + movieData['value']
            )
            tooltip.attr('data-value', movieData['value'])
        })
        .on('mouseout', (movie) => {
            tooltip.transition()
                    .style('visibility', 'hidden')
        })

    block.append('text')
         .text((movie)=>{
            return movie['data']['name']
         })
         .attr('x', 5)
         .attr('y',20)
         


}





// ------------------------------------Fetching Data-----------------------------------------------
fetch(movieDataUrl)
.then(response => response.json())
.then(data =>{
    movieData = data;
    drawTreeMap()
    console.log(movieData)
})