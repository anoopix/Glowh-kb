package sqliteToJson;

import java.util.List;
import java.util.ArrayList;

public class PubMarker {
	// Attributes
	// PubUId - links all of the tables together
	private int pub_uid;

	// 1. 'Publication' table
	private String title;
	private List<String> authors;
	private String journal;
	private int year;
	private String url;
	private String doi;
	private String access;

	// 2a. 'PubAirPollutant' table
	private List<Integer> air_pollutant_uid;

	// Connecting 'AirPollutantUId' to
	// 2b. 'AirPollutant' table
	private List<String> air_pollutant;
	private List<String> pollutant_abbrev;
	private List<String> pollutant_comment;

	// 3. 'AsthmaPubDisWeaRel' table
	private List<Integer> weather_uid;
	private List<Integer> relation_code;
	private List<String> weather_comment;

	// 4a. 'PubAtmParameter' table
	private List<Integer> atm_parameter_uid;

	// Connecting 'AtmParameterUId' to
	// 4b. 'AtmosphericParameter' table
	private List<String> primary_parameter;
	private List<String> secondary_parameter;
	private List<String> derived_parameter;
	private List<String> atm_comment;

	// 5a. 'PubDisease' table
	private List<Integer> disease_uid;
	private List<String> pub_disease_comment;

	// Connecting 'DiseaseUId' to
	// 5b. 'Disease' table
	private List<String> disease_name;
	private List<String> icd_code;
	private List<String> version;
	private List<String> disease_comment;

	// 6a. 'PubGeoLocation' table
	private int geo_location_uid;

	// Connecting 'GeoLocationUId' to
	// 6b. 'GeographicLocation' table
	private String location_in_pub;
	private String city;
	private String state;
	private String country;
	private String continent;
	private double max_lat;
	private double min_lat;
	private double max_long;
	private double min_long;
	private double latitude;
	private double longitude;

	// 7a. 'PubPollen' table
	private int pollen_uid;

	// Connecting 'PollenUId' to
	// 7b. 'PollenInfo' table
	private String pollen_type;
	private String pollen_comment;

	// 8a. 'PubStatMethod' table
	private int stat_method_uid;

	// Connecting 'statMethodUId' to
	// 8b. 'StatisticalMethod' table
	private String method_name;
	private String method_comment;

	// 9. 'StudyOutcome' table
	private String study_outcome;
	private String study_comment;

	// 10. 'StudyPeriod' table
	private int start_year;
	private int start_month;
	private int end_year;
	private int end_month;

	// 11a. 'PubSubject' table
	private int subject_type_uid;
	private String pub_subject_comment;

	// Connecting 'SubjectTypeUId' to
	// 11b. 'SubjectType' table
	private String subject_type;
	private String subject_comment;
	
	// 12. 'RelationCode' table
	private List<String> relation;

	// Constructor
	public PubMarker() {
		// 1.
		authors = new ArrayList<String>();
		// 2.
		air_pollutant_uid = new ArrayList<Integer>();
		air_pollutant = new ArrayList<String>();
		pollutant_abbrev = new ArrayList<String>();
		pollutant_comment = new ArrayList<String>();

		// 3.
		weather_uid = new ArrayList<Integer>();
		relation_code = new ArrayList<Integer>();
		relation = new ArrayList<String>();
		weather_comment = new ArrayList<String>();

		// 4.
		atm_parameter_uid = new ArrayList<Integer>();
		primary_parameter = new ArrayList<String>();
		secondary_parameter = new ArrayList<String>();
		derived_parameter = new ArrayList<String>();
		atm_comment = new ArrayList<String>();

		// 5.
		disease_uid = new ArrayList<Integer>();
		pub_disease_comment = new ArrayList<String>();
		disease_name = new ArrayList<String>();
		icd_code = new ArrayList<String>();
		version = new ArrayList<String>();
		disease_comment = new ArrayList<String>();

	}

	// toString
	public String toList(List list) {
		String listStr = "";

		for (int i = 0; i < list.size(); i++) {
			listStr += list.get(i);

			// If index is not the end of the list
			if (i != (list.size() - 1)) {
				listStr += ", ";
			}
		}

		return listStr;
	}

	public String toString() {
		String markerStr = "";
		// PubUId - links all of the tables together
		markerStr += "PublicationUId: " + get_pub_uid() + "\n";

		// 1. 'Publication' table
		markerStr += "Title: " + get_title() + "\n";
		markerStr += "Author(s): " + toList(get_authors()) + "\n";
		markerStr += "Journal: " + get_journal() + "\n";
		markerStr += "Year: " + get_year() + "\n";
		markerStr += "URL: " + get_url() + "\n";
		markerStr += "DOI: " + get_doi() + "\n";
		markerStr += "Access: " + get_access() + "\n";

		// 2a. 'PubAirPollutant' table
		markerStr += "AirPollutantUId: " + toList(get_air_pollutant_uid()) + "\n";

		// Connecting 'AirPollutantUId' to
		// 2b. 'AirPollutant' table
		markerStr += "AirPollutant: " + toList(get_air_pollutant()) + "\n";
		markerStr += "PollutantAbbrev: " + toList(get_pollutant_abbrev()) + "\n";
		markerStr += "PollutantComment: " + toList(get_pollutant_comment()) + "\n";

		// 3. 'AsthmaPubDisWeaRel' table
		markerStr += "WeatherUId: " + toList(get_weather_uid()) + "\n";
		// 12. 'RelationCode' table
		markerStr += "Relation: " + toList(get_relation()) + "\n";
		// 3 continued
		markerStr += "WeatherComment: " + toList(get_weather_comment()) + "\n";

		// 4a. 'PubAtmParameter' table
		markerStr += "AtmParameterUId: " + toList(get_atm_parameter_uid()) + "\n";

		// Connecting 'AtmParameterUId' to
		// 4b. 'AtmosphericParameter' table
		markerStr += "PrimaryParameter: " + toList(get_primary_parameter()) + "\n";
		markerStr += "SecondaryParameter: " + toList(get_secondary_parameter()) + "\n";
		markerStr += "DerivedParameter: " + toList(get_derived_parameter()) + "\n";
		markerStr += "AtmComment: " + toList(get_atm_comment()) + "\n";

		// 5a. 'PubDisease' table
		markerStr += "DiseaseUId: " + toList(get_disease_uid()) + "\n";
		markerStr += "PubDiseaseComment: " + toList(get_pub_disease_comment()) + "\n";

		// Connecting 'DiseaseUId' to
		// 5b. 'Disease' table
		markerStr += "DiseaseName: " + toList(get_disease_name()) + "\n";
		markerStr += "IcdCode: " + toList(get_icd_code()) + "\n";
		markerStr += "Version: " + toList(get_version()) + "\n";
		markerStr += "DiseaseComment: " + toList(get_disease_comment()) + "\n";

		// 6a. 'PubGeoLocation' table
		markerStr += "GeoLocationUId: " + get_geo_location_uid() + "\n";

		// Connecting 'GeoLocationUId' to
		// 6b. 'GeographicLocation' table
		markerStr += "LocationInPub: " + get_location_in_pub() + "\n";
		markerStr += "City: " + get_city() + "\n";
		markerStr += "State: " + get_state() + "\n";
		markerStr += "Country: " + get_country() + "\n";
		markerStr += "Continent: " + get_continent() + "\n";
		markerStr += "MaxLat: " + get_max_lat() + "\n";
		markerStr += "MinLat: " + get_min_lat() + "\n";
		markerStr += "MaxLong: " + get_max_long() + "\n";
		markerStr += "MinLong: " + get_min_long() + "\n";
		markerStr += "Latitude: " + get_latitude() + "\n";
		markerStr += "Longitude: " + get_longitude() + "\n";

		// 7a. 'PubPollen' table
		markerStr += "PollenUId: " + get_pollen_uid() + "\n";

		// Connecting 'PollenUId' to
		// 7b. 'PollenInfo' table
		markerStr += "PollenType: " + get_pollen_type() + "\n";
		markerStr += "PollenComment: " + get_pollen_comment() + "\n";

		// 8a. 'PubStatMethod' table
		markerStr += "StatMethodUId: " + get_stat_method_uid() + "\n";

		// Connecting 'statMethodUId' to
		// 8b. 'StatisticalMethod' table
		markerStr += "MethodName: " + get_method_name() + "\n";
		markerStr += "MethodComment: " + get_method_comment() + "\n";

		// 9. 'StudyOutcome' table
		markerStr += "StudyOutcome: " + get_study_outcome() + "\n";
		markerStr += "StudyComment: " + get_study_comment() + "\n";

		// 10. 'StudyPeriod' table
		markerStr += "StartYear: " + get_start_year() + "\n";
		markerStr += "StartMonth: " + get_start_month() + "\n";
		markerStr += "EndYear: " + get_end_year() + "\n";
		markerStr += "EndMonth: " + get_end_month() + "\n";

		// 11a. 'PubSubject' table
		markerStr += "SubjectTypeUId: " + get_subject_type_uid() + "\n";
		markerStr += "PubSubjectComment: " + get_pub_subject_comment() + "\n";

		// Connecting 'SubjectTypeUId' to
		// 11b. 'SubjectType' table
		markerStr += "SubjectType: " + get_subject_type() + "\n";
		markerStr += "SubjectComment: " + get_subject_comment() + "\n\n";

		return markerStr;
	}

	/*
	 *
	 * ACCESSORS
	 *
	 */

	// PubUId
	public int get_pub_uid() {
		return pub_uid;
	}

	// 1. Publication
	public String get_title() {
		return title;
	}

	public List<String> get_authors() {
		return authors;
	}

	public String get_journal() {
		return journal;
	}

	public int get_year() {
		return year;
	}

	public String get_url() {
		return url;
	}

	public String get_doi() {
		return doi;
	}

	public String get_access() {
		return access;
	}

	// 2. AirPollutant
	public List<Integer> get_air_pollutant_uid() {
		return air_pollutant_uid;
	}

	public List<String> get_air_pollutant() {
		return air_pollutant;
	}

	public List<String> get_pollutant_abbrev() {
		return pollutant_abbrev;
	}

	public List<String> get_pollutant_comment() {
		return pollutant_comment;
	}

	// 3. AsthmaPubDisWeaRel
	public List<Integer> get_weather_uid() {
		return weather_uid;
	}

	public List<Integer> get_relation_code() {
		return relation_code;
	}

	public List<String> get_weather_comment() {
		return weather_comment;
	}

	// 4. AtmParameter
	public List<Integer> get_atm_parameter_uid() {
		return atm_parameter_uid;
	}

	public List<String> get_primary_parameter() {
		return primary_parameter;
	}

	public List<String> get_secondary_parameter() {
		return secondary_parameter;
	}

	public List<String> get_derived_parameter() {
		return derived_parameter;
	}

	public List<String> get_atm_comment() {
		return atm_comment;
	}

	// 5. Disease
	public List<Integer> get_disease_uid() {
		return disease_uid;
	}

	public List<String> get_pub_disease_comment() {
		return pub_disease_comment;
	}

	public List<String> get_disease_name() {
		return disease_name;
	}

	public List<String> get_icd_code() {
		return icd_code;
	}

	public List<String> get_version() {
		return version;
	}

	public List<String> get_disease_comment() {
		return disease_comment;
	}

	// 6. GeoLocation
	public int get_geo_location_uid() {
		return geo_location_uid;
	}

	public String get_location_in_pub() {
		return location_in_pub;
	}

	public String get_city() {
		return city;
	}

	public String get_state() {
		return state;
	}

	public String get_country() {
		return country;
	}

	public String get_continent() {
		return continent;
	}

	public double get_max_lat() {
		return max_lat;
	}

	public double get_min_lat() {
		return min_lat;
	}

	public double get_max_long() {
		return max_long;
	}

	public double get_min_long() {
		return min_long;
	}

	public double get_latitude() {
		return latitude;
	}

	public double get_longitude() {
		return longitude;
	}

	// 7. Pollen
	public int get_pollen_uid() {
		return pollen_uid;
	}

	public String get_pollen_type() {
		return pollen_type;
	}

	public String get_pollen_comment() {
		return pollen_comment;
	}

	// 8. StatMethod
	public int get_stat_method_uid() {
		return stat_method_uid;
	}

	public String get_method_name() {
		return method_name;
	}

	public String get_method_comment() {
		return method_comment;
	}

	// 9. StudyOutcome
	public String get_study_outcome() {
		return study_outcome;
	}

	public String get_study_comment() {
		return study_comment;
	}

	// 10. StudyPeriod
	public int get_start_year() {
		return start_year;
	}

	public int get_start_month() {
		return start_month;
	}

	public int get_end_year() {
		return end_year;
	}

	public int get_end_month() {
		return end_month;
	}

	// 11. Subject
	public int get_subject_type_uid() {
		return subject_type_uid;
	}

	public String get_pub_subject_comment() {
		return pub_subject_comment;
	}

	public String get_subject_type() {
		return subject_type;
	}

	public String get_subject_comment() {
		return subject_comment;
	}
	
	// 12. RelationCode
	public List<String> get_relation() {
		return relation;
	}

	/*
	 *
	 * MUTATORS
	 *
	 */

	// PubUId
	public void set_pub_uid(int _pub_uid) {
		pub_uid = _pub_uid;
	}

	// 1. Publication
	public void set_title(String _title) {
		title = _title;
	}

	public void add_author(String _author) {
		authors.add(_author);
	}

	public void set_journal(String _journal) {
		journal = _journal;
	}

	public void set_year(int _year) {
		year = _year;
	}

	public void set_url(String _url) {
		url = _url;
	}

	public void set_doi(String _doi) {
		doi = _doi;
	}

	public void set_access(String _access) {
		access = _access;
	}

	// 2. AirPollutant
	public void add_air_pollutant_uid(int _air_pollutant_uid) {
		air_pollutant_uid.add(_air_pollutant_uid);
	}

	public void add_air_pollutant(String _air_pollutant) {
		air_pollutant.add(_air_pollutant);
	}

	public void add_pollutant_abbrev(String _pollutant_abbrev) {
		pollutant_abbrev.add(_pollutant_abbrev);
	}

	public void add_pollutant_comment(String _pollutant_comment) {
		pollutant_comment.add(_pollutant_comment);
	}

	// 3. AsthmaPubDisWeaRel
	public void add_weather_uid(int _weather_uid) {
		weather_uid.add(_weather_uid);
	}

	public void add_relation_code(int _relation_code) {
		relation_code.add(_relation_code);
	}

	public void add_weather_comment(String _weather_comment) {
		weather_comment.add(_weather_comment);
	}

	// 4. AtmParameter
	public void add_atm_parameter_uid(int _atm_parameter_uid) {
		atm_parameter_uid.add(_atm_parameter_uid);
	}

	public void add_primary_parameter(String _primary_parameter) {
		primary_parameter.add(_primary_parameter);
	}

	public void add_secondary_parameter(String _secondary_parameter) {
		secondary_parameter.add(_secondary_parameter);
	}

	public void add_derived_parameter(String _derived_parameter) {
		derived_parameter.add(_derived_parameter);
	}

	public void add_atm_comment(String _atm_comment) {
		atm_comment.add(_atm_comment);
	}

	// 5. Disease
	public void add_disease_uid(int _disease_uid) {
		disease_uid.add(_disease_uid);
	}

	public void add_pub_disease_comment(String _pub_disease_comment) {
		pub_disease_comment.add(_pub_disease_comment);
	}

	public void add_disease_name(String _disease_name) {
		disease_name.add(_disease_name);
	}

	public void add_icd_code(String _icd_code) {
		icd_code.add(_icd_code);
	}

	public void add_version(String _version) {
		version.add(_version);
	}

	public void add_disease_comment(String _disease_comment) {
		disease_comment.add(_disease_comment);
	}

	// 6. GeoLocation
	public void set_geo_location_uid(int _geo_location_uid) {
		geo_location_uid = _geo_location_uid;
	}

	public void set_location_in_pub(String _location_in_pub) {
		location_in_pub = _location_in_pub;
	}

	public void set_city(String _city) {
		city = _city;
	}

	public void set_state(String _state) {
		state = _state;
	}

	public void set_country(String _country) {
		country = _country;
	}

	public void set_continent(String _continent) {
		continent = _continent;
	}

	public void set_max_lat(double _max_lat) {
		max_lat = _max_lat;
	}

	public void set_min_lat(double _min_lat) {
		min_lat = _min_lat;
	}

	public void set_max_long(double _max_long) {
		max_long = _max_long;
	}

	public void set_min_long(double _min_long) {
		min_long = _min_long;
	}

	public void set_latitude(double _latitude) {
		latitude = _latitude;
	}

	public void set_longitude(double _longitude) {
		longitude = _longitude;
	}

	// 7. Pollen
	public void set_pollen_uid(int _pollen_uid) {
		pollen_uid = _pollen_uid;
	}

	public void set_pollen_type(String _pollen_type) {
		pollen_type = _pollen_type;
	}

	public void set_pollen_comment(String _pollen_comment) {
		pollen_comment = _pollen_comment;
	}

	// 8. StatMethod
	public void set_stat_method_uid(int _stat_method_uid) {
		stat_method_uid = _stat_method_uid;
	}

	public void set_method_name(String _method_name) {
		method_name = _method_name;
	}

	public void set_method_comment(String _method_comment) {
		method_comment = _method_comment;
	}

	// 9. StudyOutcome
	public void set_study_outcome(String _study_outcome) {
		study_outcome = _study_outcome;
	}

	public void set_study_comment(String _study_comment) {
		study_comment = _study_comment;
	}

	// 10. StudyPeriod
	public void set_start_year(int _start_year) {
		start_year = _start_year;
	}

	public void set_start_month(int _start_month) {
		start_month = _start_month;
	}

	public void set_end_year(int _end_year) {
		end_year = _end_year;
	}

	public void set_end_month(int _end_month) {
		end_month = _end_month;
	}

	// 11. Subject
	public void set_subject_type_uid(int _subject_type_uid) {
		subject_type_uid = _subject_type_uid;
	}

	public void set_pub_subject_comment(String _pub_subject_comment) {
		pub_subject_comment = _pub_subject_comment;
	}

	public void set_subject_type(String _subject_type) {
		subject_type = _subject_type;
	}

	public void set_subject_comment(String _subject_comment) {
		subject_comment = _subject_comment;
	}
	
	// 12. RelationCode
	public void add_relation(String _relation) {
		relation.add(_relation);
	}
}
