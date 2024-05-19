import React, { useState } from 'react';

const DataExtractor = () => {
  const [itemType, setItemType] = useState('');
  const [description, setDescription] = useState('');
  const [extractedInfo, setExtractedInfo] = useState('');

  const handleItemTypeChange = (e) => {
    setItemType(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleExtractClick = () => {
    let extracted = {};

    if (itemType === 'Sheet/Plate') {
      const match = description.match(/(\d{3,4})\s*([^\s]+)?\s*(\d+(\.\d+)?)\s*(MM)?\s*x\s*(\d+)\s*(MM)?\s*x\s*(\d+)\s*(MM)?\s*-\s*(\d+)\s*(TON|NO|KG|PACKET)/i);
      if (match) {
        extracted = {
          GRADE: match[1],
          MAKE: match[2] || '',
          THICKNESS: match[3] + (match[5] ? 'MM' : ''),
          WIDTH: match[6] + (match[8] ? 'MM' : ''),
          LENGTH: match[9] + (match[11] ? 'MM' : ''),
          FINISH: '',
          QUANTITY: match[10],
          WEIGHT: match[12],
        };
      }
    } else if (itemType === 'Pipe') {
      const match = description.match(/(\d+)(x(\d+))?(\s*(\d+))?\s*(\w+)?\s*(\d+)\s*(NOS)?/i);
      if (match) {
        extracted = {
          DIAMETER: match[1] + (match[2] ? 'x' + match[3] : ''),
          SIZE: '',
          TYPE: match[6] || 'NB',
          THICKNESS: '',
          LENGTH: match[5] ? match[5] + 'MTR' : '6MTR',
          FINISH: '',
          MAKE: '',
          QUANTITY: match[7],
        };
      }
    } else if (itemType === 'Flat/Angle') {
      const match = description.match(/(\d{3,4})\s*(FLAT|ANGLE)?\s*(\d+)\*?(\d+)?\s*(MM|THK)?\s*-\s*(\d+)\s*(KGS|PACKET|NO)/i);
      if (match) {
        extracted = {
          GRADE: match[1],
          THICKNESS: match[3] + 'MM',
          WIDTH: match[4] ? match[4] + 'MM' : '',
          SIZE: match[4] ? '' : match[3] + 'X' + match[3] + 'MM',
          LENGTH: '6MTR',
          FINISH: '',
          MAKE: '',
          QUANTITY: match[6],
          WEIGHT: match[7],
        };
      }
    } else if (itemType === 'Rod') {
      const match = description.match(/(\d{3,4})\s*(ROUND|SQUARE|HEX)?\s*(\d+)\s*(MM)?\s*-\s*(\d+)\s*(NOS)?/i);
      if (match) {
        extracted = {
          GRADE: match[1],
          SHAPE: match[2] || 'ROUND',
          DIAMETER: match[3] + (match[4] ? 'MM' : ''),
          SIZE: match[2] ? '' : match[3] + 'X' + match[3] + 'MM',
          LENGTH: match[5] ? match[5] + 'MTR' : '6MTR',
          FINISH: '',
          MAKE: '',
          QUANTITY: match[6] || '',
        };
      }
    } else if (itemType === 'Wire') {
      const match = description.match(/(\d{3,4})\s*(\d+(\.\d+)?)\s*(MM)?\s*-\s*(\d+)\s*(KG|PACKET|NO)/i);
      if (match) {
        extracted = {
          GRADE: match[1],
          DIAMETER: match[2] + (match[4] ? 'MM' : ''),
          LENGTH: '',
          MAKE: '',
          HARDNESS_TYPE: 'HALF HARD',
          QUANTITY: match[5],
          WEIGHT: '',
        };
      }
    }

    setExtractedInfo(JSON.stringify(extracted, null, 2));
  };

  return (
    <div style={{ marginTop: 100 }}>
      <label htmlFor="itemType">Item Type:</label>
      <select id="itemType" value={itemType} onChange={handleItemTypeChange}>
        <option value="">Select an item type</option>
        <option value="Sheet/Plate">Sheet/Plate</option>
        <option value="Pipe">Pipe</option>
        <option value="Flat/Angle">Flat/Angle</option>
        <option value="Rod">Rod</option>
        <option value="Wire">Wire</option>
      </select>

      <br />
      <br />

      <label htmlFor="description">Description:</label>
      <input type="text" id="description" style={{width:"300px"}}value={description} onChange={handleDescriptionChange} />

      <br />
      <br />

      <button onClick={handleExtractClick}>Extract Data</button>

      <br />
      <br />
     
      <textarea id="extractedInfo" style={{width:"300px",height:"200px"}}value={extractedInfo} readOnly />
    </div>
  );
};

export default DataExtractor;
