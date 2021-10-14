package sqliteToJson;

import java.io.FileWriter;
import java.io.IOException;
import org.json.simple.JSONObject;
import org.json.simple.JSONArray;
import java.util.List;

public class JsonWriter {
	// Attributes
	// Full JSON list of markers
	JSONArray jsonFull;
	
	// Represents marker currently being iterated on
	JSONObject jsonMarker;
	// Marker to be iterated on - object's info used on jsonMarker
	PubMarker current;
	
	// 1. Publication
	JSONObject publication;
	JSONArray authors;
	
	// 2. List of air pollutants
	JSONArray airPollutants;
	// Air pollutant object - to be iterated on
	JSONObject airPollutant;
	
	// 3. List of weather relations
	JSONArray weatherRelations;
	// Weather relation object - to be iterated on
	JSONObject weatherRelation;
	
	// 4. List of atmospheric parameters
	JSONArray atmParameters;
	// AtmParameter object - to be iterated on
	JSONObject atmParameter;
	
	// 5. List of diseases
	JSONArray diseases;
	// Disease object - to be iterated on
	JSONObject disease;
	
	// 6. Geo location object
	JSONObject geoLocation;
	
	// 7. Pollen object
	JSONObject pollen;
	
	// 8. Stat method object
	JSONObject statMethod;
	
	// 9. Study outcome object
	JSONObject studyOutcome;
	
	// 10. Study period object
	JSONObject studyPeriod;
	
	// 11. Subject info object
	JSONObject subjectInfo;

	// Constructor
	public JsonWriter() {
	}

	public void write(List<PubMarker> markers) {
		try {
			// Writing marker list into json file (src/json/pub_markers.json)
			FileWriter file = new FileWriter("src/json/pub_markers.json");

			// Full JSON list of markers (will be added to)
			jsonFull = new JSONArray();

			for (int i = 0; i < markers.size(); i++) {
				current = markers.get(i);
				jsonMarker = new JSONObject();

				// PubUId
				jsonMarker.put("pub_uid", current.get_pub_uid());
				
				
				
				// 1. Publication
				publication = new JSONObject();
				publication.put("title", current.get_title());
				authors = new JSONArray();
				for(int j=0; j < current.get_authors().size(); j++) {
					authors.add(current.get_authors().get(j));
				}
				publication.put("author", authors);
				publication.put("journal", current.get_journal());
				publication.put("year", current.get_year());
				publication.put("url", current.get_url());
				publication.put("doi", current.get_doi());
				publication.put("access", current.get_access());
				jsonMarker.put("publication", publication);
				
				
				
				// 2. List of air pollutants
				airPollutants = new JSONArray();
				for(int j=0; j < current.get_air_pollutant_uid().size(); j++) {
					airPollutant = new JSONObject();
					airPollutant.put("uid", current.get_air_pollutant_uid().get(j));
					airPollutant.put("pollutant", current.get_air_pollutant().get(j));
					airPollutant.put("abbrev", current.get_pollutant_abbrev().get(j));
					airPollutant.put("comment", current.get_pollutant_comment().get(j));
					airPollutants.add(airPollutant);
				}
				jsonMarker.put("air_pollutants", airPollutants);
				
				
				
				// 3. List of weather relations
				weatherRelations = new JSONArray();
				for(int j=0; j < current.get_weather_uid().size(); j++) {
					weatherRelation = new JSONObject();
					weatherRelation.put("uid", current.get_weather_uid().get(j));
					weatherRelation.put("relation", current.get_relation().get(j));
					weatherRelation.put("comment", current.get_weather_comment().get(j));
					weatherRelations.add(weatherRelation);
				}
				jsonMarker.put("weather_relations", weatherRelations);
				
				
				
				// 4. List of atmospheric parameters
				atmParameters = new JSONArray();
				for(int j=0; j < current.get_atm_parameter_uid().size(); j++) {
					atmParameter = new JSONObject();
					atmParameter.put("uid", current.get_atm_parameter_uid().get(j));
					atmParameter.put("primary", current.get_primary_parameter().get(j));
					atmParameter.put("secondary", current.get_secondary_parameter().get(j));
					atmParameter.put("derived", current.get_derived_parameter().get(j));
					atmParameter.put("comment", current.get_atm_comment().get(j));
					atmParameters.add(atmParameter);
				}
				jsonMarker.put("atm_parameters", atmParameters);
				
				
				
				// 5. List of diseases
				diseases = new JSONArray();
				for(int j=0; j < current.get_disease_uid().size(); j++) {
					disease = new JSONObject();
					disease.put("uid", current.get_disease_uid().get(j));
					disease.put("pub_comment", current.get_pub_disease_comment().get(j));
					disease.put("name", current.get_disease_name().get(j));
					disease.put("icd", current.get_icd_code().get(j));
					disease.put("version", current.get_version().get(j));
					disease.put("comment", current.get_disease_comment().get(j));
					diseases.add(disease);
				}
				jsonMarker.put("diseases", diseases);
				
				
				
				// 6. Geo location object
				geoLocation = new JSONObject();
				geoLocation.put("uid", current.get_geo_location_uid());
				geoLocation.put("location_in_pub", current.get_location_in_pub());
				geoLocation.put("city", current.get_city());
				geoLocation.put("state", current.get_state());
				geoLocation.put("country", current.get_country());
				geoLocation.put("continent", current.get_continent());
				geoLocation.put("min_long", current.get_min_long());
				geoLocation.put("min_lat", current.get_min_lat());
				geoLocation.put("max_long", current.get_max_long());
				geoLocation.put("max_lat", current.get_max_lat());
				geoLocation.put("latitude", current.get_latitude());
				geoLocation.put("longitude", current.get_longitude());
				jsonMarker.put("geo_location", geoLocation);
				
				
				
				// 7. Pollen object
				pollen = new JSONObject();
				pollen.put("uid", current.get_pollen_uid());
				pollen.put("type", current.get_pollen_type());
				pollen.put("comment", current.get_pollen_comment());
				jsonMarker.put("pollen", pollen);
				
				
				
				// 8. Stat method object
				statMethod = new JSONObject();
				statMethod.put("uid", current.get_stat_method_uid());
				statMethod.put("name", current.get_method_name());
				statMethod.put("comment", current.get_method_comment());
				jsonMarker.put("stat_method", statMethod);
				
				
				
				// 9. Study outcome object
				studyOutcome = new JSONObject();
				studyOutcome.put("outcome", current.get_study_outcome());
				studyOutcome.put("comment", current.get_study_comment());
				jsonMarker.put("study_outcome", studyOutcome);
				
				
				
				// 10. Study period object
				studyPeriod = new JSONObject();
				studyPeriod.put("start_year", current.get_start_year());
				studyPeriod.put("start_month", current.get_start_month());
				studyPeriod.put("end_year", current.get_end_year());
				studyPeriod.put("end_month", current.get_end_month());
				jsonMarker.put("study_period", studyPeriod);
				
				
				
				// 11. Subject info object
				subjectInfo = new JSONObject();
				subjectInfo.put("uid", current.get_subject_type_uid());
				subjectInfo.put("pub_comment", current.get_pub_subject_comment());
				subjectInfo.put("type", current.get_subject_type());
				subjectInfo.put("comment", current.get_subject_comment());
				jsonMarker.put("subject", subjectInfo);
				
				
				
				// Add complete marker to full list
				jsonFull.add(jsonMarker);
			}

			// Writing whole list
			file.write(jsonFull.toJSONString());
			file.close();
		} catch (IOException e) {
			System.out.println("Error writing into Json file: " + e.getMessage());
		}
	}
}