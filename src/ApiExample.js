import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { db, collection, addDoc } from '../firebase.js';

export default function App() {
  const [actesCulturals, setActesCulturals] = useState([]);

    const currentLocation = { lat: 41.38879, lon: 2.15899 }; // coordenadas de ejemplo

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().substring(0, 10);
    console.log(formattedDate)
    axios
      .get('https://analisi.transparenciacatalunya.cat/resource/rhpv-yr4f.json?$where=data_fi>%27'+formattedDate+'%27')
      .then(async (response) => {
        const filteredData = response.data;
setActesCulturals(
  filteredData.map((acteCultural) => {
    return {
      code:acteCultural.codi,
      dataini:acteCultural.data_inici,
      datafi: acteCultural.data_fi,
      title: acteCultural.denominaci,
      description: acteCultural.descripcio,
      infoCost: acteCultural.entrades,
      hour: acteCultural.horari,
      listInterests: acteCultural.tags_mbits,
      linkEvent: acteCultural.enlla_os,
      linkImage: acteCultural.imatges,
      adress: acteCultural.adre_a,
      longitud: acteCultural.longitud,
      latitud: acteCultural.latitud
    };
  })
);
  
        // Guarda los datos en Firebase
        for (let acteCultural of filteredData) {
          let linkImages =[];
          if(acteCultural.imatges){
          const images = acteCultural.imatges.split(',');
          linkImages = images.map(image => `https://agenda.cultura.gencat.cat${image}`);
          }
          let linkevents=[];
          if(acteCultural.enlla_os){
          linkevents = acteCultural.enlla_os.split(',');
          }
          
          const res = await addDoc(collection(db, 'event'), {
            code:acteCultural.codi,
            dataini:acteCultural.data_inici || ' ',
            datafi: acteCultural.data_fi,
            title: acteCultural.denominaci,
            description: acteCultural.descripcio && acteCultural.descripcio.replace(/&nbsp;/g, ' '),
            infoCost: acteCultural.entrades && acteCultural.entrades.replace(/&nbsp;/g, ' ') || '',
            hour: acteCultural.horari && acteCultural.horari.replace(/&nbsp;/g, ' ') || '',
            listInterests: acteCultural.tags_mbits.split(',').map(tag =>tag.split('/')[1]) || '',
            linkEvent: linkevents,
            linkImage: linkImages,
            adress: acteCultural.adre_a || '',
            longitud: acteCultural.longitud || '',
            latitud: acteCultural.latitud || ''
          });
        }
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  return (
    <View style={styles.container}>
      {actesCulturals.map((acteCultural, index) => (
        <Text key={index}>{acteCultural.denominaci} {acteCultural.data_fi} {acteCultural.comarca_i_municipi}</Text>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

