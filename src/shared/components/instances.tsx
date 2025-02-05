import { Component } from "inferno";
import { Helmet } from "inferno-helmet";
import { i18n } from "../i18next";
import { T } from "inferno-i18next";
import { instance_stats } from "../instance_stats";
import { numToSI } from "../utils";

const min_monthly_users = 5;

export class Instances extends Component<any, any> {
  constructor(props: any, context: any) {
    super(props, context);
  }

  render() {
    const title = i18n.t("join_title");

    var recommended_instances = instance_stats.recommended[i18n.language];
    if (!recommended_instances) {
      recommended_instances = instance_stats.recommended["en"];
    }

    var recommended = [];
    var remaining = [];
    for (var i of instance_stats.stats.instance_details) {
      if (recommended_instances.indexOf(i.domain) > -1) {
        recommended.push(i);
      } else {
        remaining.push(i);
      }
    }
    // shuffle recommended instances list into random order
    // https://stackoverflow.com/a/46545530
    let recommended2 = recommended
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    return (
      <div class="container">
        <Helmet title={title}>
          <meta property={"title"} content={title} />
        </Helmet>
        <h1 class="is-marginless">{i18n.t("lemmy_servers")}</h1>
        {this.header()}
        <br />
        <br />
        {this.renderList(i18n.t("recommended_instances"), recommended2)}
        {this.renderList(i18n.t("popular_instances"), remaining)}
      </div>
    );
  }

  header() {
    return (
      <>
        <T i18nKey="instance_explanation">
          #
          <p>
            <strong>#</strong>
          </p>
          <ul>
            <li>#</li>
          </ul>
        </T>
        <p>
          <T i18nKey="choose_instance">
            #<strong>#</strong>
          </T>
        </p>
        <p>
          {i18n.t("instance_totals", {
            instances: numToSI(instance_stats.stats.crawled_instances),
            users: numToSI(instance_stats.stats.users_active_month),
          })}
        </p>
        <T i18nKey="instance_comparison">
          #<p>#</p>
          <ul>
            <li>
              <a
                target="_blank"
                href="https://github.com/maltfield/awesome-lemmy-instances"
              >
                #
              </a>
            </li>
            <li>
              <a target="_blank" href="https://the-federation.info/platform/73">
                #
              </a>
            </li>
            <li>
              <a target="_blank" href="https://fedidb.org/software/lemmy">
                #
              </a>
            </li>
            <li>
              <a target="_blank" href="https://lemmymap.feddit.de/">
                #
              </a>
            </li>
          </ul>
        </T>
        <p>
          <T i18nKey="join_instance">
            #
            <a
              target="_blank"
              href="https://join-lemmy.org/docs/en/users/01-getting-started.html#registration"
            >
              #
            </a>
          </T>
        </p>
        <p>
          <T i18nKey="instance_browser">
            #
            <a target="_blank" href="https://browse.feddit.de/">
              #
            </a>
            <a target="_blank" href="https://lemmy.ml/post/1160417">
              #
            </a>
            <a
              target="_blank"
              href="https://join-lemmy.org/docs/en/users/01-getting-started.html#following-communities"
            >
              #
            </a>
          </T>
        </p>
      </>
    );
  }

  renderList(header: string, instances: any[]) {
    return (
      <div>
        <h2>{header}</h2>
        <div class="row">
          {instances
            .filter(
              i =>
                i.site_info.site_view.local_site.registration_mode != "closed"
            )
            .filter(
              i =>
                i.site_info.site_view.counts.users_active_month >
                min_monthly_users
            )
            .map(instance => {
              let domain = instance.domain;
              let users_active_month =
                instance.site_info.site_view.counts.users_active_month;
              let description = instance.site_info.site_view.site.description;
              let icon = instance.site_info.site_view.site.icon;
              let require_application =
                instance.site_info.site_view.site.require_application;
              return (
                <div class="card col-6">
                  <header>
                    <div class="row">
                      <h4 class="col">{domain}</h4>
                      <h4 class="col text-right">
                        <i>
                          {i18n.t("users_active_per_month", {
                            count: users_active_month,
                            formattedCount: numToSI(users_active_month),
                          })}
                        </i>
                      </h4>
                    </div>
                  </header>
                  <div class="is-center">
                    <img
                      class="join-banner"
                      src={icon || "/static/assets/images/lemmy.svg"}
                    />
                  </div>
                  <br />
                  <p class="join-desc">{description}</p>
                  <footer>
                    {require_application ? (
                      <a class="button primary" href={`https://${domain}`}>
                        {i18n.t("apply_to_join")}
                      </a>
                    ) : (
                      <a class="button primary" href={`https://${domain}`}>
                        {i18n.t("join")}
                      </a>
                    )}
                  </footer>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}
