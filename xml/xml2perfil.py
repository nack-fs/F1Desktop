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

def ToSVG():
    try:
       salida = open("perfil.svg",'w')
    except IOError:
       print ('No se puede crear el archivo perfil.svg')
       exit()

    print("Abriendo en xml/ circuitoEsquema.xml ...")
    miArchivoXML = 'circuitoEsquema.xml'
    miExpresionXPath = './/{http://www.uniovi.es}punto/{http://www.uniovi.es}coordenada/*'
    
    data = verXPath(miArchivoXML, miExpresionXPath)
    procesado = procesarLista(data)
    prologoSVG(salida,'perfil')
    writeData(salida,procesado)
    epilogoSVG(salida)

    salida.close()
    print("Guardado en xml/ perfil.svg ...")
     

def main():
    ToSVG()

def prologoSVG(archivo, nombre):
    archivo.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write('<polyline points= \n')

def epilogoSVG(archivo):
    archivo.write('style="fill:white;stroke:red;stroke-width:4" />\n')
    archivo.write("</svg>\n")

def procesarLista(lista):
    aux = list()
    x = 0
    for i in range(0,len(lista)-2,3):
        aux.append(f"{x},{lista[i+2]}")
        x+=10
    return aux

def writeData(archivo,listParsed):
    count=0
    for i in listParsed:
        if(count==0): archivo.write(f'      "{i}\n')
        elif(count==len(listParsed)-1): archivo.write(f'      {i}"\n')
        else: archivo.write(f'      {i}\n')
        count+=1

if __name__ == "__main__":
    main()    
