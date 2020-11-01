const jsonxml = require("jsontoxml");
const prettifyXml = require("prettify-xml");

module.exports = {
  /**
   * @description :: Function to prepare XML file header tag
   */
  PrepareHeaderTag: () => {
    return new Promise((resolve, reject) => {
      try {
        let xmlOptions = {
          xmlHeader: { standalone: true },
          indent: " ",
          html: false,
          prettyPrint: true,
        };
        resolve(jsonxml([], xmlOptions));
      } catch (error) {
        reject(error.message);
      }
    });
  },

  /**
   * @description :: Function to prepare root node
   * @param  {} data
   */
  PrepareRootNode: (data) => {
    return new Promise((resolve, reject) => {   //<user></user>
      try {
        let openTag = `\n<${data.name}`;
        let closeTag = `\n</${data.name}>`;

        Object.keys(data.attrs).forEach(function (key, index) {
          // key: the name of the object key
          // index: the ordinal position of the key within the object
          openTag = `${openTag} ${key}="${data.attrs[key]}" `;
        });
      //  openTag = openTag.trim() + `>`;
         openTag  =openTag+ '>';
        resolve({ start: openTag, end: closeTag });
      } catch (error) {
        reject(error.message);
      }
    });
  },

  /**
   * @description :: Function to prepare child node
   * @param  {} data
   * @param  {} isHeaderRequired=false
   */
  PrepareChildNode: (data) => {
    return new Promise((resolve, reject) => {
      try {
        let xmlOptions = {
          xmlHeader: false,
          html: false,
        };
        xmlOptions.xmlHeader = false;
        resolve(`\n${prettifyXml(jsonxml(data, xmlOptions))}`);
      } catch (err) {
        reject(err.message);
      }
    });
  },
};