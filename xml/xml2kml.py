import xml.etree.ElementTree as ET

def verXPath(archivoXML, expresionXPath):
    try:
        arbol = ET.parse(archivoXML)
        
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    raiz = arbol.getroot()
    data = list()
    
    for hijo in raiz.findall(expresionXPath):
        (f"\nElemento = {hijo.tag}")
        if hijo.text != None:
            data.append(hijo.text.strip('\n'))
            (f"\nContenido = {hijo.text.strip('\n')}")
        else:
            (f"Contenido = {hijo.text}")     
        (f"\nAtributos = {hijo.attrib}")
    return data

def ToKml():
    try:
       salida = open("circuito.kml",'w')
    except IOError:
       print ('No se puede crear el archivo circuito.kml')
       exit()

    print("Abriendo en xml/ circuitoEsquema.xml ...")
    miArchivoXML = 'circuitoEsquema.xml'
    miExpresionXPath = './/{http://www.uniovi.es}punto/{http://www.uniovi.es}coordenada/*'
    
    data = verXPath(miArchivoXML, miExpresionXPath)
    procesado = procesarLista(data)
    prologoKML(salida,'circuito')
    writeData(salida,procesado)
    epilogoKML(salida)
    salida.close()
    print("Guardado en xml/ circuito.kml ...")
     

def main():
    ToKml()

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""
    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    archivo.write("<extrude>1</extrude>\n")
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""
    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>relativeToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")

def procesarLista(lista):
    aux = list()
    for i in range(0,len(lista)-2,3):
        aux.append(f"{lista[i]},{lista[i+1]}")
    return aux

def writeData(archivo,listParsed):
    for i in listParsed:
        archivo.write(f"    {i}\n")

if __name__ == "__main__":
    main()    
