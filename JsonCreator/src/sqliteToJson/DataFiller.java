package sqliteToJson;

import java.sql.DriverManager;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import java.util.List;
import java.util.ArrayList;

public class DataFiller {

	String sql;
	int pubUId;

	/**
	 * Connect to the database
	 */
	private Connection connect() {
		// SQLite connection string
		String url = "jdbc:sqlite:src\\db\\glowh_kb.db";
		Connection conn = null;
		try {
			conn = DriverManager.getConnection(url);
		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
		return conn;
	}

	/*
	 *
	 * 11. Filling Publication data
	 *
	 */
	public void publicationFill(PubMarker marker, int index) {

		String title;
		String auth;
		String[] authArr;
		String journ;
		int year;
		String url;
		String doi;
		String acc;

		// Reading 'Publication' table
		sql = "SELECT PublicationUId, Title, Authors, Journal, Year, UrlId, DOI, Access FROM Publication";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			while (rs.next()) {
				pubUId = rs.getInt("PublicationUId");
				title = rs.getString("Title");
				auth = rs.getString("Authors");
				journ = rs.getString("Journal");
				year = rs.getInt("Year");
				url = rs.getString("UrlId");
				doi = rs.getString("DOI");
				acc = rs.getString("Access");
				
				// Creating list of authors
				authArr = auth.split(",");

				if (pubUId == index) {
					marker.set_pub_uid(pubUId);
					marker.set_title(title);
					
					for(int i=0; i < authArr.length; i++) {
						marker.add_author(authArr[i].trim());
					}

					marker.set_journal(journ);
					marker.set_year(year);
					marker.set_url(url);
					marker.set_doi(doi);
					marker.set_access(acc);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'Publication' table: " + e.getMessage());
		}
	}

	/*
	 *
	 * 2. Filling Air Pollutant data
	 *
	 */
	public void airPollutantFill(PubMarker marker) {

		int apUId;
		String ap;
		String pa;
		String com;

		// 'PubAirPollutant' table
		sql = "SELECT AirPollutantUId, PubUId FROM PubAirPollutant";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				apUId = rs.getInt("AirPollutantUId");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.add_air_pollutant_uid(apUId);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubAirPollutant' table: " + e.getMessage());
		}

		// 'AirPollutant' table
		sql = "SELECT AirPollutantUId, AirPollutant, PollutantsAbbrev, Comments FROM AirPollutant";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				apUId = rs.getInt("AirPollutantUId");
				ap = rs.getString("AirPollutant");
				pa = rs.getString("PollutantsAbbrev");
				com = rs.getString("Comments");

				for (int i = 0; i < marker.get_air_pollutant_uid().size(); i++) {
					if (apUId == marker.get_air_pollutant_uid().get(i)) {
						marker.add_air_pollutant(ap);
						marker.add_pollutant_abbrev(pa);
						marker.add_pollutant_comment(com);
					}
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'AirPollutant' table: " + e.getMessage());
		}

	}

	/*
	 *
	 * 3. Filling Asthma + Weather data
	 *
	 */
	public void asthmaWeatherFill(PubMarker marker) {

		int wUId;
		int rel;
		String com;

		// 'AsthmaPubDisWeaRel' table
		sql = "SELECT Pub_UId, Weather_UId, Relation, Comments FROM AsthmaPubDisWeaRel";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				pubUId = rs.getInt("Pub_UId");
				wUId = rs.getInt("Weather_UId");
				rel = rs.getInt("Relation");
				com = rs.getString("Comments");

				if (pubUId == marker.get_pub_uid()) {
					marker.add_weather_uid(wUId);
					marker.add_relation_code(rel);
					marker.add_weather_comment(com);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'AsthmaPubDisWeaRel' table: " + e.getMessage());
		}
	}

	/*
	 *
	 * 4. Filling Atmospheric Parameter data
	 *
	 */
	public void atmFill(PubMarker marker) {

		int atmParamUId;
		String pp;
		String sp;
		String dp;
		String com;

		// 'PubAtmParameter' table
		sql = "SELECT AtmParameterUId, PubUId FROM PubAtmParameter";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				atmParamUId = rs.getInt("AtmParameterUId");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.add_atm_parameter_uid(atmParamUId);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubAtmParameter' table: " + e.getMessage());
		}

		// 'AtmosphericParameter' table
		sql = "SELECT AtmosphericParametersUId, PrimaryParameter, SecondaryParameter, DerivedParameter, Comments FROM AtmosphericParameter";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				atmParamUId = rs.getInt("AtmosphericParametersUId");
				pp = rs.getString("PrimaryParameter");
				sp = rs.getString("SecondaryParameter");
				dp = rs.getString("DerivedParameter");
				com = rs.getString("Comments");

				for (int i = 0; i < marker.get_atm_parameter_uid().size(); i++) {
					if (atmParamUId == marker.get_atm_parameter_uid().get(i)) {
						marker.add_primary_parameter(pp);
						marker.add_secondary_parameter(sp);
						marker.add_derived_parameter(dp);
						marker.add_atm_comment(com);
					}
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'AtmosphericParameter' table: " + e.getMessage());
		}

	}

	/*
	 *
	 * 5. Filling Disease data
	 *
	 */
	public void diseaseFill(PubMarker marker) {

		int disUId;
		String pubCom;
		String dis;
		String icd;
		String ver;
		String com;

		// 'PubDisease' table
		sql = "SELECT DiseaseUId, PubUId, Comments FROM PubDisease";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				disUId = rs.getInt("DiseaseUId");
				pubUId = rs.getInt("PubUId");
				pubCom = rs.getString("Comments");

				if (pubUId == marker.get_pub_uid()) {
					marker.add_disease_uid(disUId);
					marker.add_pub_disease_comment(pubCom);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubDisease' table: " + e.getMessage());
		}

		// 'Disease' table
		sql = "SELECT DiseaseUId, DiseaseName, ICDCode, Version, Comment FROM Disease";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				disUId = rs.getInt("DiseaseUId");
				dis = rs.getString("DiseaseName");
				icd = rs.getString("ICDCode");
				ver = rs.getString("Version");
				com = rs.getString("Comment");

				for (int i = 0; i < marker.get_disease_uid().size(); i++) {
					if (disUId == marker.get_disease_uid().get(i)) {
						marker.add_disease_name(dis);
						marker.add_icd_code(icd);
						marker.add_version(ver);
						marker.add_disease_comment(com);
					}
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'Disease' table: " + e.getMessage());
		}

	}

	/*
	 *
	 * 6. Filling GeoLocation data
	 *
	 */
	public void geoLocFill(PubMarker marker) {

		int geoLocUId;
		String locInPub;
		String city;
		String state;
		String coun;
		String cont;

		double maxLat;
		double minLat;
		double maxLong;
		double minLong;
		double lat;
		double lon;

		// 'PubGeoLocation' table
		sql = "SELECT GeoLocationUId, PubUId FROM PubGeoLocation";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				geoLocUId = rs.getInt("GeoLocationUId");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_geo_location_uid(geoLocUId);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubGeoLocation' table: " + e.getMessage());
		}

		// 'GeographicLocation' table
		sql = "SELECT GeographicLocationUId, LocationInPub, City, State, Country, Continent, MaxLat, MinLat, MaxLong, MinLong, Latitude, Longitude FROM GeographicLocation";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				geoLocUId = rs.getInt("GeographicLocationUId");
				locInPub = rs.getString("LocationInPub");
				city = rs.getString("City");
				state = rs.getString("State");
				coun = rs.getString("Country");
				cont = rs.getString("Continent");
				maxLat = strToDoub(rs.getString("MaxLat"));
				minLat = strToDoub(rs.getString("MinLat"));
				maxLong = strToDoub(rs.getString("MaxLong"));
				minLong = strToDoub(rs.getString("MinLong"));
				lat = strToDoub(rs.getString("Latitude"));
				lon = strToDoub(rs.getString("Longitude"));

				if (geoLocUId == marker.get_geo_location_uid()) {
					marker.set_location_in_pub(locInPub);
					marker.set_city(city);
					marker.set_state(state);
					marker.set_country(coun);
					marker.set_continent(cont);
					marker.set_max_lat(maxLat);
					marker.set_min_lat(minLat);
					marker.set_max_long(maxLong);
					marker.set_min_long(minLong);
					marker.set_latitude(lat);
					marker.set_longitude(lon);
				}

			}

		} catch (SQLException e) {
			System.out.println("Error reading 'GeographicLocation' table: " + e.getMessage());
		}

	}

	// Converting string to double (Used in 'GeoLocation' table)
	public double strToDoub(String str) {
		double doub;
		if (str == null) {
			doub = 0;
		} else {
			doub = Double.parseDouble(str);
		}
		return doub;
	}

	/*
	 *
	 * 7. Filling Pollen data
	 *
	 */
	public void pollenFill(PubMarker marker) {

		int pollUId;
		String pollType;
		String com;

		// 'PubPollen' table
		sql = "SELECT PollenUId, PubUId FROM PubPollen";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				pollUId = rs.getInt("PollenUId");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_pollen_uid(pollUId);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubPollen' table: " + e.getMessage());
		}

		// 'PollenInfo' table
		sql = "SELECT PollenUId, PollenType, Comment FROM PollenInfo";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				pollUId = rs.getInt("PollenUId");
				pollType = rs.getString("PollenType");
				com = rs.getString("Comment");

				if (pollUId == marker.get_pollen_uid()) {
					marker.set_pollen_type(pollType);
					marker.set_pollen_comment(com);
				}

			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PollenInfo' table: " + e.getMessage());
		}
	}

	/*
	 *
	 * 8. Filling Statistical Method data
	 *
	 */
	public void statFill(PubMarker marker) {

		int statUId;
		String methodName;
		String com;

		// 'PubStatMethod' table
		sql = "SELECT StatisticalMethodUId, PubUId FROM PubStatMethod";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				statUId = rs.getInt("StatisticalMethodUId");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_stat_method_uid(statUId);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubStatMethod' table: " + e.getMessage());
		}

		// 'StatisticalMethod' table
		sql = "SELECT StatisticalMethodsUId, MethodName, Comment FROM StatisticalMethod";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				statUId = rs.getInt("StatisticalMethodsUId");
				methodName = rs.getString("MethodName");
				com = rs.getString("Comment");

				if (statUId == marker.get_stat_method_uid()) {
					marker.set_method_name(methodName);
					marker.set_method_comment(com);
				}

			}

		} catch (SQLException e) {
			System.out.println("Error reading 'StatisticalMethod' table: " + e.getMessage());
		}

	}

	/*
	 *
	 * 9. Filling Study Outcome data
	 *
	 */
	public void outcomeFill(PubMarker marker) {

		String outcome;
		String com;

		// 'StudyOutcome' table
		sql = "SELECT Outcome, Comment, PubUId FROM StudyOutcome";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				outcome = rs.getString("Outcome");
				com = rs.getString("Comment");
				pubUId = rs.getInt("PubUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_study_outcome(outcome);
					marker.set_study_comment(com);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'StudyOutcome' table: " + e.getMessage());
		}

	}

	/*
	 *
	 * 10. Filling Study Period data
	 *
	 */
	public void periodFill(PubMarker marker) {

		int stYr;
		int stMnth;
		int endYr;
		int endMnth;

		// 'StudyPeriod' table
		sql = "SELECT StartYear, StartMonth, EndYear, EndMonth, PublicationUId FROM StudyPeriod";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				stYr = rs.getInt("StartYear");
				stMnth = rs.getInt("StartMonth");
				endYr = rs.getInt("EndYear");
				endMnth = rs.getInt("EndMonth");
				pubUId = rs.getInt("PublicationUId");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_start_year(stYr);
					marker.set_start_month(stMnth);
					marker.set_end_year(endYr);
					marker.set_end_month(endMnth);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'StudyPeriod' table: " + e.getMessage());
		}
	}

	/*
	 *
	 * 11. Filling Subject data
	 *
	 */
	public void subjectFill(PubMarker marker) {

		int subUId;
		String pubCom;
		String subType;
		String com;

		// 'PubSubject' table
		sql = "SELECT SubjectTypeUId, PubUId, Comment FROM PubSubject";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				subUId = rs.getInt("SubjectTypeUId");
				pubUId = rs.getInt("PubUId");
				pubCom = rs.getString("Comment");

				if (pubUId == marker.get_pub_uid()) {
					marker.set_subject_type_uid(subUId);
					marker.set_pub_subject_comment(pubCom);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'PubSubject' table: " + e.getMessage());
		}

		// 'SubjectType' table
		sql = "SELECT SubjectTypeUId, SubjectType, Comment FROM SubjectType";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				subUId = rs.getInt("SubjectTypeUId");
				subType = rs.getString("SubjectType");
				com = rs.getString("Comment");

				if (subUId == marker.get_subject_type_uid()) {
					marker.set_subject_type(subType);
					marker.set_subject_comment(com);
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'SubjectType' table: " + e.getMessage());
		}
	}
	
	/*
	 *
	 * 12. Relation data
	 *
	 */
	public void relationFill(PubMarker marker) {
		
		int relUId;
		String relStr;
		
		// 'RelationCode' table
		sql = "SELECT RelationCode_UId, RelationStr FROM RelationCode";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			// loop through the table
			while (rs.next()) {
				
				relUId = rs.getInt("RelationCode_UId");
				relStr = rs.getString("RelationStr");
				
				for(int i=0; i < marker.get_relation_code().size(); i++) {
					if(relUId == marker.get_relation_code().get(i)) {
						marker.add_relation(relStr);
					}
				}
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'RelationCode' table: " + e.getMessage());
		}
	}

	public void fillAllData(PubMarker marker, int index) {
		publicationFill(marker, index);
		airPollutantFill(marker);
		asthmaWeatherFill(marker);
		atmFill(marker);
		diseaseFill(marker);
		geoLocFill(marker);
		pollenFill(marker);
		statFill(marker);
		outcomeFill(marker);
		periodFill(marker);
		subjectFill(marker);
		relationFill(marker);
	}

	public List<Integer> pubIdList() {
		List<Integer> list = new ArrayList<Integer>();

		sql = "SELECT PublicationUId FROM Publication";

		try (Connection conn = this.connect();
				Statement stmt = conn.createStatement();
				ResultSet rs = stmt.executeQuery(sql)) {

			while (rs.next()) {
				pubUId = rs.getInt("PublicationUId");
				list.add(pubUId);
			}

		} catch (SQLException e) {
			System.out.println("Error reading 'Publication' table: " + e.getMessage());
		}

		return list;
	}
}