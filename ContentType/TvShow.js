
let jsonToXMLParser = require("../Parser/JSONtoXMLParser");
function showProcess(result){
    return new Promise(async (resolve,reject)=>{
        try {
            let show_obj = [{
                name: "TVEpisode",
                text: "",
                attrs: {},
                children: [
                    {name: "Id", text: result.id, attrs: "", children: []},
                    {name: "ExternalID", text: "1", attrs: "", children: []},
                    {name: "Title", text: result.title_brief, attrs: "", children: []},
                    {
                        name: "Copyright",
                        text: "English",
                        attrs: "",
                        children: [],
                    },
                    {
                        name: "Offers",
                        text: "",
                        attrs: "",
                        children: [
                            {
                                name: "SubscriptionOffer",
                                text: "",
                                attrs: {},
                                children: [
                                    {
                                        name: "Regions", text: "", attrs: "", children: [
                                            {
                                                name: "Country",
                                                text: "IN",
                                                attrs: "",
                                                children: []
                                            },
                                        ]
                                    },
                                    {
                                        name: "LaunchDetails", text: "", attrs: "", children: [
                                            {name: "Quality", text: "", attrs: "", children: []},
                                            {name: "AudioLangauge", text: "", attrs: "", children: []},
                                            {name: "Subtitle", text: "", attrs: "", children: []},
                                            {name: "LaunchId", text: "", attrs: "", children: []}
                                        ]
                                    },
                                    {name: "WindowStart", text: "", attrs: "", children: []},
                                    {name: "WindowEnd", text: "", attrs: "", children: []}
                                ],
                            },
                            {
                                name: "FreeOffer",
                                text: "",
                                attrs: {},
                                children: [
                                    {
                                                name: "Regions", text: "", attrs: "", children: [
                                                    {
                                                        name: "Country",
                                                        text: "IN",
                                                        attrs: "",
                                                        children: []
                                                    },
                                                ]
                                            },
                                            {
                                                name: "LaunchDetails", text: "", attrs: "", children: [
                                                    {name: "Quality", text: "", attrs: "", children: []},
                                                    {
                                                        name: "AudioLangauge",
                                                        text: result.languages,
                                                        attrs: "",
                                                        children: []
                                                    },
                                                    {name: "Subtitle", text: "", attrs: "", children: []},
                                                    {name: "LaunchId", text: "", attrs: "", children: []}
                                                ]
                                            },
                                            {name: "WindowStart", text: "", attrs: "", children: []},
                                            {name: "WindowEnd", text: "", attrs: "", children: []}
                                        ],
                                    },
                                ],
                            },
                            {name: "ReleaseYear", text: result.year_of_release, attrs: "", children: []},
                            {name: "ShortDescription", text: result.summary_long, attrs: "", children: []},
                            {
                                name: "Synopsis",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "MetaDataAvailabalityDate",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "Images",
                                text: "",
                                attrs: "",
                                children: [
                                    {
                                        name: "Image", text: "", attrs: "", children: [
                                            {name: "url", text: result.box_cover_image, attrs: "", children: []},
                                            {name: "Locale", text: "", attrs: "", children: []},
                                        ]
                                    },
                                ]
                            },
                            {
                                name: "RuntimeMinutes",
                                text: result.display_run_time,
                                attrs: "",
                                children: []
                            },
                            {
                                name: "Color",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "Credits",
                                text: "",
                                attrs: "",
                                children: [
                                    {
                                        name: "CastMember", text: "", attrs: "", children: [
                                            {name: "Name", text: "", attrs: "", children: []},
                                            {name: "ExternalId", text: "", attrs: "", children: []},
                                            {name: "Role", text: "", attrs: "", children: []},
                                        ]
                                    },
                                    {
                                        name: "CrewMember", text: "", attrs: "", children: [
                                            {name: "Name", text: "", attrs: "", children: []},
                                            {name: "ExternalId", text: "", attrs: "", children: []},
                                            {name: "Job", text: "", attrs: "", children: []},
                                        ]
                                    },
                                ]
                            },
                            {
                                name: "Studios",
                                text: "",
                                attrs: "",
                                children: [
                                    {name: "studio", text: "", attrs: "", children: []},
                                ]
                            },
                            {
                                name: "Language",
                                text: result.languages,
                                attrs: "",
                                children: []
                            },
                            {
                                name: "CustomerRating",
                                text: "",
                                attrs: "",
                                children: [
                                    {name: "Score", text: "", attrs: "", children: []},
                                    {name: "MaxValue", text: "", attrs: "", children: []},
                                    {name: "Count", text: "", attrs: "", children: []},
                                ]
                            },
                            {
                                name: "Rank",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "Source",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "Genres",
                                text: "",
                                attrs: "",
                                children: [
                                    {name: "Genre", text: "", attrs: "", children: []},
                                ]
                            },
                            {
                                name: "ContentRatings",
                                text: "",
                                attrs: "",
                                children: [
                                    {
                                        name: "ContentRating", text: "", attrs: "", children: [
                                            {name: "System", text: "", attrs: "", children: []},
                                            {name: "Certification", text: "", attrs: "", children: []},
                                        ]
                                    },
                                ]
                            },
                            {
                                name: "JP_Require18PlusAgeConfirmation",
                                text: "",
                                attrs: "",
                                children: []
                            },

                            {
                                name: "ShowID",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "ShowTitle",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "SeasonID",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "SeasonInShow",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "SeasonTitle",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "EpisodeInSeason",
                                text: "",
                                attrs: "",
                                children: []
                            },
                            {
                                name: "OriginalAirDate",
                                text: "",
                                attrs: "",
                                children: []
                            }

                        ],


            }]

            let showNodeTag= await jsonToXMLParser.PrepareChildNode(show_obj);
            writeStream.write(showNodeTag);
            resolve(true);
        }
        catch (err) {
            reject(err.message);
        }

    })
}
module.exports=showProcess;
