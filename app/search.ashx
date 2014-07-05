/*
Requires CsQuery
*/
<%@ WebHandler Language="C#" Class="SofiaSearch" Debug="true" %>

using System;
using System.Web;
using System.Net;
using System.IO;
using System.Xml;
using System.Collections;
using System.Collections.Generic;
using System.Text;

using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using CsQuery;

public class SofiaSearch : IHttpHandler
{

    Regex isLemmaRegExp = new Regex("([GgHh])\\d{1,6}");

	const int HASHSIZE = 20;

	JavaScriptSerializer jss = null;


	public int HashWord(string theWord) {
		int i;
		int hash = 0;
		for (i = 0; i < theWord.Length; i++) {
			hash += (int)(theWord[i]);
			hash %= HASHSIZE;
		}
		return hash;
	}

    public void ProcessRequest (HttpContext context) {
		HttpResponse Response = context.Response;
		HttpRequest Request = context.Request;

		string textid = Request["textid"] + "";
		string search = Request["search"] + "";
		string callback = Request["callback"] + "";


		var results = new SearchResults();
		results.textid = textid;
		results.search = search;
		//results.results2 = new Dictionary<string, string>();
		results.results = new List<object>();

		jss = new JavaScriptSerializer();


		// SEARCH TYPE
		string searchType = "AND";
		bool isLemmaSearch = isLemmaRegExp.IsMatch(search);


		// LOAD INDEXES
		var indexes = new List<List<string>>();
		string[] words = search.Split(new char[] {' '});

		string basePath = context.Server.MapPath("~/study/content/texts/");
		string pathToText = Path.Combine(basePath, textid);

		foreach (string word in words) {

			string pathToIndex = pathToText;
			string key = "";


			if (isLemmaSearch) {
				key = word.ToUpper();

				string letter = word.Substring(0,1);
				string number = word.Substring(1,1);

				results.hash = key;

				pathToIndex = Path.Combine(pathToIndex, "indexlemma");
				pathToIndex = Path.Combine(pathToIndex, "_" + letter + number + "000" + ".json");


				//results.hash = pathToIndex;
			} else {

				key = word.ToLower();

				string hashedWord = HashWord(key).ToString();

				results.hash = hashedWord;

				pathToIndex = Path.Combine(pathToIndex, "index");
				pathToIndex = Path.Combine(pathToIndex, "_" + hashedWord + ".json");
			}


			if (File.Exists(pathToIndex)) {

				string contents = File.ReadAllText(pathToIndex);
				dynamic data = jss.Deserialize<dynamic>(contents);
				object[] verseArray = null;
				List<string> verseList = new List<string>();
				indexes.Add(verseList);

				try {

					verseArray = data[key];

				} catch (Exception e) {

					results.errorMessage = e.ToString() + "Can't find: " + key.ToLower() + " in " + pathToIndex;
					continue;
				}

				// nasty way to convert object[] to string[]
				foreach (var verse in verseArray) {
					if (verse != null) {
						verseList.Add(verse.ToString());
					}
				}
			} else {

				results.errorMessage = "Can't find: " + pathToIndex;
			}
		}


		if (indexes.Count == 0) {

			results.success = false;
			results.errorMessage = "Found no indexes";

			SendJson(context.Response, results, callback);
			return;
		}

		// COMBINE INDEXES
		var combinedIndex = new List<string>();

		if (searchType == "AND") {
			if (indexes.Count == 1) {
				combinedIndex = indexes[0];
			} else {

				combinedIndex = indexes[0].FindAll(delegate(string verseid) {
					var inAllArrays = true;

					// search other arrays
					for (var i=1; i<indexes.Count; i++) {
						if (!indexes[i].Contains(verseid)) {
							inAllArrays = false;
							continue;
						}
					}

					return inAllArrays;
				});
			}
		}

		//results.verses = combinedIndex;

		// LOAD VERSES

		foreach (var verseid in combinedIndex) {
			var parts = verseid.Split(new char[] {'_'});
			var chapterid = parts[0];
			var pathToChapter = Path.Combine(pathToText, chapterid + ".html");

			if (!File.Exists(pathToChapter)) {
				continue;
			}

			var chapterHtml = File.ReadAllText(pathToChapter);


			CQ dom = chapterHtml;
			CQ verses = dom["." + verseid];

			string verseHtml = "";

			foreach (var verseNode in verses) {

				((CQ)verseNode[".note"]).Remove();

				verseHtml += System.Net.WebUtility.HtmlDecode(verseNode.Render());

			}


			var r = new Dictionary<string,string>();
			r.Add(verseid, verseHtml);


			results.results.Add(r );
			//results.results2.Add(verseid.ToString(),verseHtml );

		}


		// DONE!
		SendJson(context.Response, results, callback);
    }

    void SendJson(HttpResponse response, SearchResults results, string callback) {
		System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
		response.ContentType = "application/json";

		var jsonString = serializer.Serialize( results );

		//jsonString = Regex.Replace(jsonString, "results\":{([^}]+?)}","results\":[$1]");
		//jsonString = jsonString.Replace("results\":{","results\":[");
		//jsonString = jsonString.Replace("}}","]}");

		if (callback != "") {
			response.Write( callback + "(" );
		}

		response.Write( jsonString );

		if (callback != "") {
			response.Write( ")" );
		}

	    response.End();
    }

    public bool IsReusable {
        get {
            return false;
        }
    }


    public class SearchResults {
	    public string textid {get;set;}

	    public string search {get;set;}

	    public string hash {get;set;}

	    public string errorMessage {get;set;}

	    public bool success {get;set;}

		public List<string> verses { get; set; }

	    public List<List<string>> indexes { get; set; }

	    public List<object> results {get;set;}

	    //public Dictionary<string, string> results2 {get;set;}
    }


}
